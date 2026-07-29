"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { metaFor, techIconMap } from "@/lib/project-meta";
import { projectDescription, type Project } from "@/lib/projects";
import { ProjectPoster } from "./ProjectPoster";

export function ProjectCard({
  project,
  locale,
  priority = false,
}: {
  project: Project;
  locale: string;
  priority?: boolean;
}) {
  const meta = metaFor(project.category);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-colors duration-300 hover:border-white/20 focus-within:border-white/25"
    >
      <ProjectPoster
        project={project}
        priority={priority}
        variant="embedded"
        className="aspect-[16/10] w-full"
      />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: meta.color }}
          >
            {project.category}
          </span>
          <span className="font-mono text-[10px] text-white/45">{project.year}</span>
        </div>

        <h3 className="font-heading text-lg font-bold leading-tight text-white">
          {/*
            Stretched link: the whole card is the hit target, but only one
            focusable element ends up in the tab order.
          */}
          <Link
            href={`/projects/${project.slug}`}
            className="rounded outline-none after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {project.title}
          </Link>
        </h3>

        <p className="line-clamp-3 text-sm leading-relaxed text-white/60">
          {projectDescription(project, locale)}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
          {project.tech.slice(0, 4).map((tech) => {
            const icon = techIconMap[tech];
            return (
              <span
                key={tech}
                className="flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-white/60"
              >
                {icon && <icon.Icon size={10} style={{ color: icon.color }} />}
                {tech}
              </span>
            );
          })}
          {project.tech.length > 4 && (
            <span className="font-mono text-[10px] text-white/45">
              +{project.tech.length - 4}
            </span>
          )}
        </div>
      </div>

      <ArrowUpRight
        size={16}
        className="absolute right-4 top-4 z-10 text-white/0 transition-colors duration-300 group-hover:text-white/70"
        aria-hidden
      />
    </motion.article>
  );
}
