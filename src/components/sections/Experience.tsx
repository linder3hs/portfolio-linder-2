"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { readableAccent } from "@/lib/project-meta";

interface ExperienceEntry {
  title: string;
  company: string;
  period: string;
  tags?: string[];
  context?: string;
  bullets: string[];
}

// Alternating dot colors to add visual rhythm
const dotColors = [
  { bg: "#7C3AED", glow: "rgba(124,58,237,0.7)" },
  { bg: "#A855F7", glow: "rgba(168,85,247,0.7)" },
  { bg: "#C084FC", glow: "rgba(192,132,252,0.7)" },
  { bg: "#7C3AED", glow: "rgba(124,58,237,0.7)" },
  { bg: "#A855F7", glow: "rgba(168,85,247,0.7)" },
  { bg: "#C084FC", glow: "rgba(192,132,252,0.7)" },
  { bg: "#7C3AED", glow: "rgba(124,58,237,0.7)" },
];

export function Experience() {
  const t = useTranslations("experience");
  const entries = t.raw("entries") as ExperienceEntry[];
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.15"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gradient mb-4">
            {t("title")}
          </h2>
          <p className="text-white/60 text-sm">{t("subtitle")}</p>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mt-4" />
        </motion.div>

        <div ref={containerRef} className="relative">
          {/* Animated timeline line */}
          <div className="absolute left-8 top-2 bottom-2 w-px bg-white/[0.05]">
            <motion.div
              style={{
                height: lineHeight,
                background: "linear-gradient(to bottom, #7C3AED, #A855F7, #C084FC)",
              }}
              className="w-full origin-top"
            />
          </div>

          {entries.map((entry, i) => {
            const dot = dotColors[i % dotColors.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-20 pb-10 last:pb-0"
              >
                {/* Pulse ring on dot for current role */}
                {i === 0 && (
                  <div
                    className="absolute left-4 top-0.5 w-8 h-8 rounded-full animate-pulse-ring"
                    style={{ background: dot.bg + "30" }}
                  />
                )}

                {/* Timeline dot */}
                <div
                  className="absolute left-5 top-1.5 w-5 h-5 rounded-full border-2 border-white/20 z-10"
                  style={{
                    background: dot.bg,
                    boxShadow: `0 0 14px ${dot.glow}, 0 0 4px ${dot.glow}`,
                  }}
                />

                {/* Card */}
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-xl p-6 bg-white/[0.03] backdrop-blur-xl border border-white/[0.07] transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_24px_rgba(124,58,237,0.1)] group"
                >
                  {/* Header row */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-heading font-bold text-white text-base md:text-lg leading-tight">
                        {entry.title}
                      </h3>
                      <p
                        className="text-sm font-semibold mt-0.5"
                        style={{ color: readableAccent(dot.bg) }}
                      >
                        {entry.company}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-white/55 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.06] shrink-0">
                      {entry.period}
                    </span>
                  </div>

                  {/* Context label */}
                  {entry.context && (
                    <p className="text-white/55 text-xs italic mb-4 leading-relaxed">
                      {entry.context}
                    </p>
                  )}

                  {/* Stack tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full text-white/60 bg-white/[0.04] border border-white/[0.06]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bullets */}
                  <ul className="space-y-2.5">
                    {entry.bullets.map((bullet, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.07 + j * 0.05 }}
                        className="text-white/70 text-sm flex gap-3 leading-relaxed"
                      >
                        <span
                          className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                          style={{ background: dot.bg }}
                        />
                        {bullet}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
