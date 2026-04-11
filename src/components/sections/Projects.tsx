"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { ArrowUpRight, Star, ChevronsDown } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNodedotjs,
  SiPrisma, SiPostgresql, SiSupabase, SiFramer, SiOpenai, SiExpo,
} from "react-icons/si";
import { TbBrandFramerMotion, TbBrain } from "react-icons/tb";
import { featuredProjects } from "@/lib/projects";
import type { IconType } from "react-icons";

/* ─── Maps ──────────────────────────────────────────────────── */
const techIconMap: Record<string, { Icon: IconType; color: string }> = {
  "React":          { Icon: SiReact,            color: "#61DAFB" },
  "Next.js":        { Icon: SiNextdotjs,         color: "#ffffff" },
  "TypeScript":     { Icon: SiTypescript,        color: "#3178C6" },
  "Tailwind CSS":   { Icon: SiTailwindcss,       color: "#06B6D4" },
  "Framer Motion":  { Icon: TbBrandFramerMotion,  color: "#E8468C" },
  "Node.js":        { Icon: SiNodedotjs,         color: "#339933" },
  "Prisma":         { Icon: SiPrisma,            color: "#5A67D8" },
  "PostgreSQL":     { Icon: SiPostgresql,        color: "#4169E1" },
  "Supabase":       { Icon: SiSupabase,          color: "#3ECF8E" },
  "Framer":         { Icon: SiFramer,            color: "#0055FF" },
  "Claude API":     { Icon: SiOpenai,            color: "#74AA9C" },
  "OpenAI API":     { Icon: SiOpenai,            color: "#74AA9C" },
  "Claude Code":    { Icon: TbBrain,             color: "#CC785C" },
  "Expo":           { Icon: SiExpo,              color: "#ffffff" },
};

const categoryMeta: Record<string, { emoji: string; color: string }> = {
  ai:        { emoji: "✨", color: "#74AA9C" },
  fullstack: { emoji: "🚀", color: "#A855F7" },
  devtools:  { emoji: "🛠️", color: "#F59E0B" },
  frontend:  { emoji: "⚡", color: "#06B6D4" },
  backend:   { emoji: "⚙️", color: "#22C55E" },
};

/* ─── Floating badge positions (orbit around the emoji) ─────── */
const orbPositions = [
  { angle: -60,  radius: 148 },
  { angle:  30,  radius: 152 },
  { angle: 120,  radius: 144 },
  { angle: 210,  radius: 150 },
];

/* ─── Component ─────────────────────────────────────────────── */
export function Projects() {
  const t = useTranslations("projects");
  const locale = useLocale();

  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(
      Math.floor(v * featuredProjects.length),
      featuredProjects.length - 1,
    );
    if (next !== activeIndex) {
      setDirection(next > activeIndex ? 1 : -1);
      setActiveIndex(next);
    }
  });

  const project = featuredProjects[activeIndex];
  const meta = categoryMeta[project.category] ?? categoryMeta.fullstack;
  const total = featuredProjects.length;

  const scrollToProject = (idx: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const ratio = idx / total + 0.001;
    window.scrollTo({
      top: el.offsetTop + ratio * el.offsetHeight,
      behavior: "smooth",
    });
  };

  const skipSection = () => {
    const el = sectionRef.current;
    if (!el) return;
    window.scrollTo({
      top: el.offsetTop + el.offsetHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* ── Scroll track ──────────────────────────────────────── */}
      <section
        id="projects"
        ref={sectionRef}
        style={{ height: `${total * 100}dvh` }}
        className="relative"
      >
        {/* ── Sticky viewport ───────────────────────────────── */}
        <div
          className="sticky top-0 overflow-hidden"
          style={{ height: "100dvh" }}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                `radial-gradient(ellipse 55% 65% at 72% 52%, ${meta.color}12, transparent 68%)`,
              ],
            }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            key={activeIndex}
          />

          {/* Subtle grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(124,58,237,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.035) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* ── Layout ──────────────────────────────────────── */}
          <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex flex-col">

            {/* Top bar */}
            <div className="flex items-center justify-between pt-20 pb-2">
              <div className="flex items-center gap-3">
                <span className="text-white/25 text-xs font-mono uppercase tracking-widest">
                  {t("title")}
                </span>
                <div
                  className="h-px w-8"
                  style={{
                    background: `linear-gradient(to right, ${meta.color}60, transparent)`,
                  }}
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-white/20 tabular-nums">
                  {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(total).padStart(2, "0")}
                </span>
                <motion.button
                  onClick={skipSection}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 text-white/35 hover:text-white/70"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {t("skip")}
                  <ChevronsDown size={12} />
                </motion.button>
              </div>
            </div>

            {/* Main content row */}
            <div className="flex-1 flex flex-col lg:flex-row items-center gap-10 lg:gap-16 py-6">

              {/* ── Left: text content ──────────────────────── */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: direction * 48 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: direction * -48 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col gap-6"
                  >
                    {/* Category + year badges */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                        style={{
                          background: `${meta.color}18`,
                          border: `1px solid ${meta.color}35`,
                          color: meta.color,
                        }}
                      >
                        {meta.emoji}&nbsp;{project.category}
                      </span>
                      <span className="font-mono text-xs text-white/25">
                        {project.year}
                      </span>
                      {project.featured && (
                        <span
                          className="flex items-center gap-1 text-xs font-medium"
                          style={{ color: meta.color }}
                        >
                          <Star size={10} fill="currentColor" />
                          {t("featured")}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2
                      className="font-heading font-bold leading-none text-white"
                      style={{
                        fontSize: "clamp(2.4rem, 5vw, 4rem)",
                        textShadow: `0 0 60px ${meta.color}30`,
                      }}
                    >
                      {project.title}
                    </h2>

                    {/* Description */}
                    <p className="text-white/55 text-base md:text-lg leading-relaxed max-w-md">
                      {locale === "es" ? project.descriptionEs : project.description}
                    </p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => {
                        const iconData = techIconMap[tech];
                        return iconData ? (
                          <motion.span
                            key={tech}
                            whileHover={{ scale: 1.07, y: -1 }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium"
                            style={{
                              background: `${iconData.color}10`,
                              border: `1px solid ${iconData.color}22`,
                              color:
                                iconData.color === "#ffffff"
                                  ? "rgba(255,255,255,0.6)"
                                  : iconData.color,
                            }}
                          >
                            <iconData.Icon size={11} />
                            {tech}
                          </motion.span>
                        ) : (
                          <span
                            key={tech}
                            className="px-3 py-1.5 text-xs rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20"
                          >
                            {tech}
                          </span>
                        );
                      })}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 flex-wrap">
                      {project.liveUrl && (
                        <motion.a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.04, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                          style={{
                            background: `${meta.color}18`,
                            border: `1px solid ${meta.color}45`,
                            color: meta.color,
                            boxShadow: `0 0 28px ${meta.color}18`,
                          }}
                        >
                          <ArrowUpRight size={15} />
                          {t("live")}
                        </motion.a>
                      )}
                      {project.githubUrl && (
                        <motion.a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.04, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white/45 hover:text-white/80 transition-all duration-300"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.09)",
                          }}
                        >
                          <FiGithub size={15} />
                          {t("code")}
                        </motion.a>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ── Right: visual ───────────────────────────── */}
              <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.88, y: direction * 32 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: direction * -32 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-[380px] h-[380px] flex items-center justify-center"
                  >
                    {/* Outer glow ring */}
                    <motion.div
                      className="absolute rounded-full"
                      animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.28, 0.15] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      style={{
                        width: 280,
                        height: 280,
                        background: `radial-gradient(circle, ${meta.color}45, transparent 68%)`,
                      }}
                    />

                    {/* Inner glow */}
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: 160,
                        height: 160,
                        background: `radial-gradient(circle, ${meta.color}30, transparent 70%)`,
                      }}
                    />

                    {/* Big emoji */}
                    <motion.div
                      animate={{ y: [0, -14, 0], rotate: [0, 4, -4, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="relative z-10 select-none"
                      style={{
                        fontSize: "5.5rem",
                        filter: `drop-shadow(0 0 32px ${meta.color}70)`,
                      }}
                    >
                      {meta.emoji}
                    </motion.div>

                    {/* Orbiting tech badges */}
                    {project.tech.slice(0, 4).map((tech, ti) => {
                      const iconData = techIconMap[tech];
                      if (!iconData) return null;
                      const { angle, radius } = orbPositions[ti] ?? { angle: ti * 90, radius: 148 };
                      const rad = (angle * Math.PI) / 180;
                      const x = Math.cos(rad) * radius;
                      const y = Math.sin(rad) * radius;
                      return (
                        <motion.div
                          key={tech}
                          className="absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium z-20 select-none"
                          style={{
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                            transform: "translate(-50%, -50%)",
                            background: `${iconData.color}12`,
                            border: `1px solid ${iconData.color}30`,
                            color:
                              iconData.color === "#ffffff"
                                ? "rgba(255,255,255,0.65)"
                                : iconData.color,
                            backdropFilter: "blur(10px)",
                          }}
                          animate={{ y: [0, -8 + ti * 3, 0] }}
                          transition={{
                            duration: 3.5 + ti * 0.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: ti * 0.4,
                          }}
                        >
                          <iconData.Icon size={11} />
                          {tech}
                        </motion.div>
                      );
                    })}

                    {/* Decorative orbit ring */}
                    <div
                      className="absolute rounded-full border pointer-events-none"
                      style={{
                        width: 300,
                        height: 300,
                        borderColor: `${meta.color}12`,
                        borderStyle: "dashed",
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex items-end justify-between pb-8">
              {/* Scroll hint */}
              <p className="text-white/18 text-xs font-mono tracking-widest">
                {t("scroll_hint")}
              </p>

              {/* Progress dots */}
              <div className="flex items-center gap-2">
                {featuredProjects.map((_, di) => (
                  <motion.button
                    key={di}
                    onClick={() => scrollToProject(di)}
                    whileHover={{ scale: 1.3 }}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: di === activeIndex ? 22 : 6,
                      height: 6,
                      background:
                        di === activeIndex
                          ? meta.color
                          : "rgba(255,255,255,0.15)",
                      boxShadow:
                        di === activeIndex
                          ? `0 0 8px ${meta.color}80`
                          : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── View all CTA ──────────────────────────────────────── */}
      <div className="py-16 flex justify-center px-4">
        <motion.a
          href="https://github.com/linder3hs"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium text-white/55 hover:text-white border border-white/10 hover:border-purple-500/35 transition-all duration-300 hover:shadow-[0_0_24px_rgba(124,58,237,0.18)]"
          style={{
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(12px)",
          }}
        >
          <FiGithub size={15} />
          {t("all")}
        </motion.a>
      </div>
    </>
  );
}
