import Image from "next/image";
import { metaFor, techIconMap } from "@/lib/project-meta";
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
}: {
  project: Project;
  priority?: boolean;
  className?: string;
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

  // Primary tech drives the watermark glyph, so two projects rarely look alike.
  const primary = project.tech.find((t) => techIconMap[t]);
  const PrimaryIcon = primary ? techIconMap[primary].Icon : null;

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

      {/* Oversized watermark of the project's primary technology */}
      {PrimaryIcon && (
        <PrimaryIcon
          className="absolute"
          size={260}
          style={{
            color: meta.color,
            opacity: 0.09,
            right: "-14%",
            bottom: "-22%",
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

      {/* Title block */}
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
