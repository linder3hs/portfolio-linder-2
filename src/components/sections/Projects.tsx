"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { ArrowUpRight, ChevronsDown, Star } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { featuredProjects, projects, projectDescription } from "@/lib/projects";
import { metaFor, techIconMap } from "@/lib/project-meta";
import { ProjectPoster } from "@/components/projects/ProjectPoster";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Projects() {
  const t = useTranslations("projects");
  const locale = useLocale();
  const reduceMotion = useReducedMotion();

  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const total = featuredProjects.length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(Math.floor(v * total), total - 1);
    if (next !== activeIndex) {
      setDirection(next > activeIndex ? 1 : -1);
      setActiveIndex(next);
    }
  });

  const project = featuredProjects[activeIndex];
  const meta = metaFor(project.category);

  const scrollToProject = (idx: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const ratio = idx / total + 0.001;
    window.scrollTo({
      top: el.offsetTop + ratio * el.offsetHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const skipSection = () => {
    const el = sectionRef.current;
    if (!el) return;
    window.scrollTo({
      top: el.offsetTop + el.offsetHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  // Left/right arrows move between projects when the dot group has focus.
  const handleDotKeys = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      scrollToProject(Math.min(activeIndex + 1, total - 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      scrollToProject(Math.max(activeIndex - 1, 0));
    }
  };

  const slide = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: direction * 40 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: direction * -40 },
      };

  return (
    <>
      {/* Scroll track — one viewport of scroll per featured project. */}
      <section
        id="projects"
        ref={sectionRef}
        style={{ height: `${total * 100}dvh` }}
        className="relative"
        aria-roledescription="carousel"
        aria-label={t("title")}
      >
        <div className="sticky top-0 h-[100dvh] overflow-hidden">
          <motion.div
            key={activeIndex}
            aria-hidden
            className="pointer-events-none absolute inset-0"
            animate={{
              background: `radial-gradient(ellipse 55% 65% at 72% 52%, ${meta.color}14, transparent 68%)`,
            }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(124,58,237,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.035) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col px-6">
            {/* Top bar */}
            <div className="flex items-center justify-between pb-2 pt-20">
              <div className="flex items-center gap-3">
                <h2 className="font-mono text-xs uppercase tracking-widest text-white/55">
                  {t("title")}
                </h2>
                <div
                  aria-hidden
                  className="h-px w-8"
                  style={{
                    background: `linear-gradient(to right, ${meta.color}80, transparent)`,
                  }}
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs tabular-nums text-white/50">
                  {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(total).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={skipSection}
                  className="flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60 outline-none transition-colors duration-300 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  {t("skip")}
                  <ChevronsDown size={12} aria-hidden />
                </button>
              </div>
            </div>

            {/* Main row */}
            <div className="flex flex-1 flex-col items-center gap-10 py-6 lg:flex-row lg:gap-16">
              <div
                className="flex w-full flex-col justify-center lg:w-1/2"
                aria-live="polite"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    {...slide}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="flex flex-col gap-5"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className="rounded-full px-3 py-1.5 text-xs font-medium"
                        style={{
                          background: `${meta.color}1F`,
                          border: `1px solid ${meta.color}40`,
                          color: meta.color,
                        }}
                      >
                        {meta.glyph} {project.category}
                      </span>
                      <span className="font-mono text-xs text-white/50">
                        {project.year}
                      </span>
                      {project.featured && (
                        <span
                          className="flex items-center gap-1 text-xs font-medium"
                          style={{ color: meta.color }}
                        >
                          <Star size={10} fill="currentColor" aria-hidden />
                          {t("featured")}
                        </span>
                      )}
                    </div>

                    <h3
                      className="font-heading font-bold leading-none text-white"
                      style={{ fontSize: "clamp(2.2rem, 4.6vw, 3.6rem)" }}
                    >
                      {project.title}
                    </h3>

                    <p className="max-w-md text-base leading-relaxed text-white/65 md:text-lg">
                      {projectDescription(project, locale)}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => {
                        const icon = techIconMap[tech];
                        return (
                          <span
                            key={tech}
                            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/70"
                          >
                            {icon && (
                              <icon.Icon size={11} style={{ color: icon.color }} />
                            )}
                            {tech}
                          </span>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold outline-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white/60"
                        style={{
                          background: `${meta.color}1F`,
                          border: `1px solid ${meta.color}4D`,
                          color: meta.color,
                        }}
                      >
                        {t("case_study")}
                        <ArrowUpRight size={15} aria-hidden />
                      </Link>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white/70 outline-none transition-colors duration-300 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
                        >
                          {t("live")}
                          <ArrowUpRight size={15} aria-hidden />
                        </a>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Visual */}
              <div className="hidden items-center justify-center lg:flex lg:w-1/2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={
                      reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.94, y: direction * 24 }
                    }
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={
                      reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.96, y: direction * -24 }
                    }
                    transition={{ duration: 0.55, ease: EASE }}
                    className="w-full max-w-[520px]"
                  >
                    <ProjectPoster
                      project={project}
                      priority={activeIndex === 0}
                      className="aspect-[16/10] w-full rounded-2xl border border-white/10"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex items-end justify-between pb-8">
              <p className="font-mono text-xs tracking-widest text-white/45">
                {t("scroll_hint")}
              </p>

              <div
                role="tablist"
                aria-label={t("title")}
                onKeyDown={handleDotKeys}
                className="flex items-center gap-2"
              >
                {featuredProjects.map((p, di) => (
                  <button
                    key={p.slug}
                    type="button"
                    role="tab"
                    aria-selected={di === activeIndex}
                    aria-label={p.title}
                    tabIndex={di === activeIndex ? 0 : -1}
                    onClick={() => scrollToProject(di)}
                    className="rounded-full outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white/60"
                    style={{
                      width: di === activeIndex ? 22 : 6,
                      height: 6,
                      background:
                        di === activeIndex ? meta.color : "rgba(255,255,255,0.28)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exit to the full index — the carousel is a highlight reel, not the archive. */}
      <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-16">
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
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white/55 outline-none transition-colors duration-300 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <FiGithub size={15} aria-hidden />
          {t("all")}
        </a>
      </div>
    </>
  );
}
