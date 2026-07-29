import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const alt = "Linder Hassinger — AI Tech Lead & AI Consultant";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * The homepage had no OG image at all — sharing the root URL produced a blank
 * card, and that root URL is the one link a consultant actually sends out.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  const isEs = locale === "es";

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
          backgroundImage:
            "radial-gradient(ellipse 75% 70% at 82% 0%, #7C3AED55, transparent 62%), radial-gradient(ellipse 60% 55% at 5% 100%, #C084FC22, transparent 60%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#4ADE80",
            }}
          />
          <span
            style={{
              fontSize: 22,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#C4B5FD",
            }}
          >
            {isEs ? "Disponible para consultoría de IA" : "Available for AI consulting"}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1 }}>
            Linder Hassinger
          </div>
          <div style={{ fontSize: 40, fontWeight: 600, color: "#C084FC" }}>
            {isEs ? "AI Tech Lead & Consultor de IA" : "AI Tech Lead & AI Consultant"}
          </div>
          <div
            style={{
              fontSize: 27,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.65)",
              maxWidth: 940,
            }}
          >
            {t("subtitle")}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 26,
            fontSize: 24,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <span>linderhassinger.dev</span>
          <span>{isEs ? "Lima, Perú · Remoto global" : "Lima, Peru · Remote worldwide"}</span>
        </div>
      </div>
    ),
    size,
  );
}
