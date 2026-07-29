"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import {
  featuredProjects,
  projects,
  projectDescription,
  type Project,
} from "@/lib/projects";
import { metaFor, techIconMap } from "@/lib/project-meta";
import { ProjectPoster } from "@/components/projects/ProjectPoster";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Bento placement for the first four featured projects. Anything beyond the
 * fourth falls back to a single cell, so the layout survives the data changing.
 */
const CELLS = [
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-3",
];

function TechChips({ tech, limit }: { tech: string[]; limit: number }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tech.slice(0, limit).map((name) => {
        const icon = techIconMap[name];
        return (
          <span
            key={name}
            className="flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-white/65"
          >
            {icon && <icon.Icon size={10} style={{ color: icon.color }} />}
            {name}
          </span>
        );
      })}
      {tech.length > limit && (
        <span className="font-mono text-[10px] text-white/50">
          +{tech.length - limit}
        </span>
      )}
    </div>
  );
}

function Meta({ project }: { project: Project }) {
  const meta = metaFor(project.category);
  return (
    <div className="flex items-center gap-3">
      <span
        className="font-mono text-[10px] uppercase tracking-[0.18em]"
        style={{ color: meta.color }}
      >
        {meta.glyph} {project.category}
      </span>
      <span className="font-mono text-[10px] text-white/50">{project.year}</span>
    </div>
  );
}

function BentoCard({
  project,
  index,
  layout,
}: {
  project: Project;
  index: number;
  layout: "hero" | "compact" | "wide";
}) {
  const locale = useLocale();
  const t = useTranslations("projects");
  const reduceMotion = useReducedMotion();
  const meta = metaFor(project.category);

  const shell =
    "group relative flex h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] outline-none transition-colors duration-300 hover:border-white/25 focus-within:border-white/30";

  // The whole card is clickable, but only the title is in the tab order.
  const title = (
    <h3 className="font-heading font-bold leading-tight text-white">
      <Link
        href={`/projects/${project.slug}`}
        className="rounded outline-none after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:ring-white/60"
      >
        {project.title}
      </Link>
    </h3>
  );

  const cta = (
    <span
      className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold transition-transform duration-300 group-hover:translate-x-0.5"
      style={{ color: meta.color }}
    >
      {t("case_study")}
      <ArrowUpRight size={14} aria-hidden />
    </span>
  );

  return (
    <motion.article
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
      className={`${shell} ${layout === "wide" ? "flex-col md:flex-row" : "flex-col"}`}
    >
      {/* Accent that only reads on hover — keeps the resting grid calm. */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 z-10 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)`,
        }}
      />

      <ProjectPoster
        project={project}
        priority={index === 0}
        variant="embedded"
        className={
          layout === "wide"
            ? "aspect-[16/10] w-full shrink-0 md:aspect-auto md:w-2/5"
            : "min-h-[96px] w-full flex-1"
        }
      />

      <div
        className={`flex flex-col gap-3 ${
          layout === "hero" ? "p-7" : "p-4"
        } ${layout === "wide" ? "md:w-3/5 md:justify-center" : ""}`}
      >
        <Meta project={project} />

        <div className={layout === "hero" ? "text-2xl" : "text-lg"}>{title}</div>

        {layout !== "compact" && (
          <p className="line-clamp-3 text-sm leading-relaxed text-white/65">
            {projectDescription(project, locale)}
          </p>
        )}

        <TechChips tech={project.tech} limit={layout === "compact" ? 2 : 4} />

        {layout !== "compact" && cta}
      </div>
    </motion.article>
  );
}

export function Projects() {
  const t = useTranslations("projects");

  return (
    <section id="projects" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-white/60">
              {t("title")}
            </h2>
            <div
              aria-hidden
              className="h-px w-10 bg-gradient-to-r from-purple-400/70 to-transparent"
            />
          </div>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/65">
            {t("subtitle")}
          </p>
        </motion.div>

        {/*
          Auto rows give the 2x2 hero cell the height of the two compact cells
          it sits beside, so the poster can flex to fill instead of being pinned
          to an aspect ratio.
        */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[minmax(250px,auto)]">
          {featuredProjects.map((project, i) => (
            <div key={project.slug} className={CELLS[i] ?? "lg:col-span-1"}>
              <BentoCard
                project={project}
                index={i}
                layout={i === 0 ? "hero" : i === 3 ? "wide" : "compact"}
              />
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-6 py-2.5 text-sm font-medium text-white/75 outline-none transition-colors duration-300 hover:border-purple-400/40 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {t("view_all", { count: projects.length })}
            <ArrowUpRight size={15} aria-hidden />
          </Link>
          <a
            href="https://github.com/linder3hs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white/60 outline-none transition-colors duration-300 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <FiGithub size={15} aria-hidden />
            {t("all")}
          </a>
        </div>
      </div>
    </section>
  );
}
