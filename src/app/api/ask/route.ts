import Anthropic from "@anthropic-ai/sdk";
import { buildSiteContext } from "@/lib/site-context";

export const maxDuration = 60;

const MAX_QUESTION_CHARS = 500;
const MAX_HISTORY_TURNS = 8;

/**
 * ponytail: in-memory rate limit. It is per server instance, so it does not
 * hold across a scaled-out deployment — swap in a shared store (Redis, Upstash)
 * if this ever runs on more than one instance. It is here because this is an
 * unauthenticated endpoint that spends money on every call.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

type Turn = { role: "user" | "assistant"; content: string };

function systemPrompt(locale: string) {
  return `You are the assistant on Linder Hassinger's portfolio site. You answer questions about Linder from visitors — recruiters, potential clients, and other engineers.

Answer only from the context below. If the context does not cover something, say you don't have that detail and point the visitor at Linder's email (linderhassinger00@gmail.com). Never invent projects, employers, dates, metrics, or client names.

Decline questions that are not about Linder, his work, or hiring him — briefly, then offer what you can help with instead.

Write in ${locale === "es" ? "Spanish" : "English"} unless the visitor writes in another language, in which case match theirs. Keep answers to a short paragraph or a few bullets. Be concrete and specific rather than promotional — visitors can read the marketing copy themselves. Speak about Linder in the third person.

Write plain text. This surface renders newlines but no markdown, so asterisks, underscores, backticks, and heading marks appear literally to the visitor — do not use them. For a list, put each item on its own line starting with "- ".

<context>
${buildSiteContext()}
</context>`;
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: { question?: unknown; history?: unknown; locale?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question || question.length > MAX_QUESTION_CHARS) {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const locale = body.locale === "es" ? "es" : "en";

  // Trust nothing from the client beyond shape: roles are constrained to the
  // two valid values and the transcript is truncated before it reaches the API.
  const history: Turn[] = Array.isArray(body.history)
    ? (body.history as unknown[])
        .filter(
          (t): t is Turn =>
            typeof t === "object" &&
            t !== null &&
            (("role" in t && (t as Turn).role === "user") ||
              ("role" in t && (t as Turn).role === "assistant")) &&
            typeof (t as Turn).content === "string",
        )
        .slice(-MAX_HISTORY_TURNS)
        .map((t) => ({ role: t.role, content: t.content.slice(0, 2000) }))
    : [];

  const client = new Anthropic();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const message = client.messages.stream({
          // Grounded Q&A over a prompt that already contains every answer.
          // Haiku is the right tier for it, and this endpoint is public and
          // unauthenticated — the cheap model is also the safe one.
          // Note: `output_config.effort` is not supported on Haiku 4.5 and
          // returns a 400, and thinking is off unless explicitly enabled.
          model: "claude-haiku-4-5",
          max_tokens: 1024,
          system: [
            {
              type: "text",
              text: systemPrompt(locale),
              // The system prompt is identical on every request, so caching it
              // would make each question cost the question rather than the
              // corpus. Measured at ~2.9k tokens today, which is under Haiku
              // 4.5's 4096-token cacheable minimum — so this silently does
              // nothing yet and every question pays full input price (~$0.004).
              // It starts working on its own once the projects and posts push
              // the prompt past 4096. The [ask] log line below is how you tell.
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: [...history, { role: "user", content: question }],
        });

        message.on("text", (delta) => {
          controller.enqueue(encoder.encode(delta));
        });

        const final = await message.finalMessage();

        // Cost visibility in production logs. cache_read_input_tokens sitting
        // at 0 across requests means the prompt fell under the model's
        // cacheable minimum (4096 tokens on Haiku 4.5) and every question is
        // paying for the whole corpus.
        const u = final.usage;
        console.log(
          `[ask] in=${u.input_tokens} out=${u.output_tokens} ` +
            `cache_write=${u.cache_creation_input_tokens ?? 0} ` +
            `cache_read=${u.cache_read_input_tokens ?? 0}`,
        );

        if (final.stop_reason === "refusal") {
          controller.enqueue(
            encoder.encode(
              locale === "es"
                ? "\n\nNo puedo responder eso. Escríbele a Linder directamente."
                : "\n\nI can't answer that one. Email Linder directly.",
            ),
          );
        }
      } catch (error) {
        console.error("ask route failed", error);
        controller.enqueue(
          encoder.encode(
            locale === "es"
              ? "Algo falló de mi lado. Intenta de nuevo."
              : "Something broke on my side. Try again.",
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
