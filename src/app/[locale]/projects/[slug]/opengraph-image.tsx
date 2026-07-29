import { ImageResponse } from "next/og";
import { getProject, projectDescription, projects } from "@/lib/projects";
import { metaFor } from "@/lib/project-meta";
import { routing } from "@/i18n/routing";

export const alt = "Project by Linder Hassinger";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug })),
  );
}

/**
 * Share card. Uses the system font stack rather than fetching Space Grotesk at
 * build time — an extra network dependency in the build for a font nobody sees
 * next to the real thing isn't worth it.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return new ImageResponse(<div style={{ background: "#0A0A0F" }} />, size);
  }

  const meta = metaFor(project.category);

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
          backgroundImage: `radial-gradient(ellipse 80% 70% at 85% 0%, ${meta.color}33, transparent 65%)`,
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* A drawn swatch, not meta.glyph — the OG renderer's font has no
              geometric shapes and renders them as tofu. */}
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              background: meta.color,
            }}
          />
          <span
            style={{
              color: meta.color,
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {project.category}
          </span>
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 22 }}>
            {project.year}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
            {project.title}
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.68)",
              maxWidth: 900,
            }}
          >
            {projectDescription(project, locale)}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 28,
            fontSize: 24,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.85)" }}>Linder Hassinger</span>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>
            {project.tech.slice(0, 4).join("  ·  ")}
          </span>
        </div>
      </div>
    ),
    size,
  );
}
