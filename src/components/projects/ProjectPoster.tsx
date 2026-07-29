import Image from "next/image";
import {
  distinctiveTech,
  metaFor,
  posterComposition,
  techIconMap,
} from "@/lib/project-meta";
import type { Project } from "@/lib/projects";

/**
 * Visual for a project. Uses the real screenshot when `project.image` is set,
 * otherwise draws a generated poster so a project is never represented by
 * nothing. Drop a PNG at /public/projects/<slug>.png and set `image` to
 * upgrade any of these to the real thing.
 */
export function ProjectPoster({
  project,
  priority = false,
  className = "",
  /**
   * "embedded" drops the poster's own title block, for cards that already print
   * the title beneath it. Leaving it on duplicated every title in the grid.
   */
  variant = "standalone",
}: {
  project: Project;
  priority?: boolean;
  className?: string;
  variant?: "standalone" | "embedded";
}) {
  const meta = metaFor(project.category);

  if (project.image) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={project.image}
          alt={`${project.title} screenshot`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          className="object-cover"
        />
      </div>
    );
  }

  // Rarest technology, not the first one — otherwise every Next.js project
  // draws the same mark and the grid reads as one repeated tile.
  const signature = distinctiveTech(project);
  const SignatureIcon = signature ? techIconMap[signature].Icon : null;
  const composition = posterComposition(project.slug);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: "#0B0B12" }}
      aria-hidden
    >
      {/* Category-tinted wash */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 90% 80% at 78% 15%, ${meta.color}26, transparent 65%), radial-gradient(ellipse 70% 90% at 10% 95%, ${meta.color}14, transparent 60%)`,
        }}
      />

      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `linear-gradient(${meta.color}0D 1px, transparent 1px), linear-gradient(90deg, ${meta.color}0D 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Oversized watermark, placed from a hash of the slug */}
      {SignatureIcon && (
        <SignatureIcon
          className="absolute"
          size={composition.size}
          style={{
            color: meta.color,
            opacity: 0.1,
            right: composition.right,
            bottom: composition.bottom,
            transform: `rotate(${composition.rotate}deg)`,
          }}
        />
      )}

      {/* Window chrome — reads as "this is a running app" */}
      <div className="absolute inset-x-6 top-6 flex items-center gap-1.5">
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <span
            key={c}
            className="rounded-full"
            style={{ width: 8, height: 8, background: c, opacity: 0.55 }}
          />
        ))}
        <span
          className="ml-3 truncate font-mono text-[10px]"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          {project.liveUrl?.replace(/^https?:\/\//, "") ?? project.slug}
        </span>
      </div>

      {variant === "standalone" && (
        <div className="absolute inset-x-6 bottom-6">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.2em]"
            style={{ color: meta.color }}
          >
            {meta.glyph} {project.category}
          </span>
          <p className="font-heading mt-1.5 text-2xl font-bold leading-tight text-white">
            {project.title}
          </p>
        </div>
      )}

      {/* Top edge accent */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${meta.color}80, transparent)`,
        }}
      />
    </div>
  );
}
