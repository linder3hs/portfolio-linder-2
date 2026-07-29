"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUp, Sparkles } from "lucide-react";

type Turn = { role: "user" | "assistant"; content: string };

const MAX_CHARS = 500;

export function AskLinder() {
  const t = useTranslations("ask");
  const locale = useLocale();
  const reduceMotion = useReducedMotion();

  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "streaming" | "error">("idle");
  const [errorKey, setErrorKey] = useState<"generic" | "rate_limited" | "offline">("generic");

  const logRef = useRef<HTMLDivElement>(null);

  // Follow the stream as it grows, unless the visitor asked for reduced motion.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns]);

  const suggestions = t.raw("suggestions") as string[];

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || status === "streaming") return;

    const history = turns;
    setTurns([...history, { role: "user", content: trimmed }, { role: "assistant", content: "" }]);
    setInput("");
    setStatus("streaming");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, history, locale }),
      });

      if (!response.ok || !response.body) {
        setErrorKey(
          response.status === 429
            ? "rate_limited"
            : response.status === 503
              ? "offline"
              : "generic",
        );
        setStatus("error");
        setTurns(history);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setTurns((current) => {
          const next = [...current];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, content: last.content + chunk };
          return next;
        });
      }

      setStatus("idle");
    } catch {
      setErrorKey("generic");
      setStatus("error");
      setTurns(history);
    }
  }

  const hasConversation = turns.length > 0;

  return (
    <section id="ask" className="px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <span className="glass mb-6 inline-flex items-center gap-2 rounded-full border border-purple-400/25 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-purple-200">
            <Sparkles size={12} aria-hidden />
            {t("eyebrow")}
          </span>
          <h2 className="font-heading text-gradient mb-4 text-3xl font-bold md:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-white/60">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          {hasConversation && (
            <div
              ref={logRef}
              className="mb-4 max-h-96 space-y-4 overflow-y-auto pr-1"
              aria-live="polite"
              aria-busy={status === "streaming"}
            >
              {turns.map((turn, i) => (
                <div
                  key={i}
                  className={
                    turn.role === "user"
                      ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-purple-500/15 px-4 py-2.5 text-sm text-white/90"
                      : "max-w-[92%] text-sm leading-relaxed text-white/75"
                  }
                >
                  {turn.content ||
                    (status === "streaming" ? (
                      <span className="inline-flex gap-1" aria-label={t("thinking")}>
                        {[0, 1, 2].map((d) => (
                          <motion.span
                            key={d}
                            className="h-1.5 w-1.5 rounded-full bg-purple-300"
                            animate={reduceMotion ? undefined : { opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: d * 0.2 }}
                          />
                        ))}
                      </span>
                    ) : null)}
                </div>
              ))}
            </div>
          )}

          {status === "error" && (
            <p role="status" className="mb-3 text-sm text-red-300">
              {t(`errors.${errorKey}`)}
            </p>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void ask(input);
            }}
            className="flex items-end gap-2"
          >
            <label htmlFor="ask-input" className="sr-only">
              {t("label")}
            </label>
            <input
              id="ask-input"
              value={input}
              maxLength={MAX_CHARS}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholder")}
              disabled={status === "streaming"}
              className="w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/45 focus-visible:ring-2 focus-visible:ring-purple-400 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === "streaming" || !input.trim()}
              aria-label={t("send")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white outline-none transition-colors hover:bg-violet-500 focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowUp size={17} aria-hidden />
            </button>
          </form>

          {!hasConversation && (
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void ask(s)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/65 outline-none transition-colors hover:border-purple-400/40 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="mt-3 text-center text-xs text-white/45">{t("disclaimer")}</p>
      </div>
    </section>
  );
}
