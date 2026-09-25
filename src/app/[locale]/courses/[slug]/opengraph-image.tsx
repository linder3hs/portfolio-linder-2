import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";
import { addMinutes, formatDate } from "@/lib/calendar";
import { courses, getCourse, pick } from "@/lib/courses";

export const alt = "Live course by Linder Hassinger";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    courses.map((course) => ({ locale, slug: course.id })),
  );
}

/**
 * The landing is shared on WhatsApp more than anywhere, and without its own
 * card it would inherit the consulting one from the locale root. System font,
 * like the project cards, for the same reason.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const course = getCourse(slug);

  if (!course) {
    return new ImageResponse(<div style={{ background: "#0A0A0F" }} />, size);
  }

  const isEs = locale === "es";
  const start = formatDate(course.startDate, isEs ? "es-PE" : "en-US", {
    day: "numeric",
    month: "long",
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0A0A0F",
          backgroundImage: `radial-gradient(ellipse 80% 70% at 85% 0%, ${course.accent}40, transparent 65%)`,
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26 }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: course.accent }} />
          <span style={{ color: course.accent }}>
            {isEs ? "Curso en vivo" : "Live course"}
          </span>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>
            {`${isEs ? "Inicio" : "Starts"} ${start}`}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1 }}>
            {pick(course.title, locale)}
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.68)",
              maxWidth: 960,
            }}
          >
            {pick(course.summary, locale)}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 28,
            fontSize: 26,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.85)" }}>Linder Hassinger</span>
          <div style={{ display: "flex", gap: 36 }}>
            <span style={{ color: "rgba(255,255,255,0.55)" }}>
              {`${isEs ? "Martes y jueves" : "Tue & Thu"} ${course.time}–${addMinutes(course.time, course.durationMin)}`}
            </span>
            <span style={{ color: course.accent }}>{`S/ ${course.price}`}</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
