"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { projects, usedCategories, type ProjectCategory } from "@/lib/projects";
import { metaFor } from "@/lib/project-meta";
import { ProjectCard } from "./ProjectCard";

type Filter = ProjectCategory | "all";

export function ProjectGrid() {
  const t = useTranslations("projects");
  const locale = useLocale();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

  const options: Filter[] = ["all", ...usedCategories];

  return (
    <>
      <div
        role="group"
        aria-label={t("filter_label")}
        className="mb-10 flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const active = filter === option;
          const color = option === "all" ? "#C084FC" : metaFor(option).color;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={active}
              className="rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              style={{
                borderColor: active ? `${color}66` : "rgba(255,255,255,0.12)",
                background: active ? `${color}1F` : "transparent",
                color: active ? color : "rgba(255,255,255,0.65)",
              }}
            >
              {t(`filters.${option}`)}
              <span className="ml-2 font-mono text-[10px] opacity-70">
                {option === "all"
                  ? projects.length
                  : projects.filter((p) => p.category === option).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Screen readers get told the result count changed, since the grid updates silently. */}
      <p aria-live="polite" className="sr-only">
        {t("results", { count: filtered.length })}
      </p>

      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              locale={locale}
              priority={i < 3}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
