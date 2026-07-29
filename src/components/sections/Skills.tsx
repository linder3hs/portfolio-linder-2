"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiHtml5,
  SiCss,
  SiRedux,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiDjango,
  SiRubyonrails,
  SiGraphql,
  SiPrisma,
  SiPostgresql,
  SiSupabase,
  SiDocker,
  SiVercel,
  SiGit,
  SiGithubactions,
  SiFigma,
  SiOpenai,
  SiExpo,
  SiStripe,
} from "react-icons/si";
import { FiCloud } from "react-icons/fi";
import { TbBrandFramerMotion, TbBrain } from "react-icons/tb";
import type { IconType } from "react-icons";
import { readableAccent } from "@/lib/project-meta";

interface Skill {
  name: string;
  Icon: IconType;
  color: string;
}

const skillCategories: {
  key: string;
  icon: IconType;
  iconColor: string;
  wide?: boolean;
  skills: Skill[];
}[] = [
  {
    // AI leads the grid and spans full width — this is the positioning, not a
    // footnote. It is deliberately short: only tools actually in use go here.
    key: "ai",
    icon: TbBrain,
    iconColor: "#CC785C",
    wide: true,
    skills: [
      { name: "Claude API", Icon: SiOpenai, color: "#74AA9C" },
      { name: "OpenAI API", Icon: SiOpenai, color: "#74AA9C" },
      { name: "Claude Code", Icon: TbBrain, color: "#CC785C" },
    ],
  },
  {
    key: "frontend",
    icon: SiReact,
    iconColor: "#61DAFB",
    skills: [
      { name: "React", Icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", Icon: SiNextdotjs, color: "#ffffff" },
      { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
      { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Framer Motion", Icon: TbBrandFramerMotion, color: "#E8468C" },
      { name: "Redux", Icon: SiRedux, color: "#764ABC" },
      { name: "React Native", Icon: SiReact, color: "#61DAFB" },
      { name: "Expo", Icon: SiExpo, color: "#4630EB" },
      { name: "HTML5", Icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", Icon: SiCss, color: "#1572B6" },
    ],
  },
  {
    key: "backend",
    icon: SiPython,
    iconColor: "#3776AB",
    skills: [
      { name: "Python", Icon: SiPython, color: "#3776AB" },
      { name: "Django", Icon: SiDjango, color: "#092E20" },
      { name: "Node.js", Icon: SiNodedotjs, color: "#339933" },
      { name: "Express", Icon: SiExpress, color: "#ffffff" },
      { name: "Rails", Icon: SiRubyonrails, color: "#CC0000" },
      { name: "GraphQL", Icon: SiGraphql, color: "#E10098" },
      { name: "Prisma", Icon: SiPrisma, color: "#2D3748" },
      { name: "WebSockets", Icon: SiNodedotjs, color: "#339933" },
    ],
  },
  {
    key: "tools",
    icon: SiDocker,
    iconColor: "#2496ED",
    skills: [
      { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1" },
      { name: "Supabase", Icon: SiSupabase, color: "#3ECF8E" },
      { name: "Docker", Icon: SiDocker, color: "#2496ED" },
      { name: "AWS", Icon: FiCloud, color: "#FF9900" },
      { name: "Vercel", Icon: SiVercel, color: "#ffffff" },
      { name: "Git", Icon: SiGit, color: "#F05032" },
      { name: "GitHub Actions", Icon: SiGithubactions, color: "#2088FF" },
      { name: "Stripe", Icon: SiStripe, color: "#635BFF" },
      { name: "Figma", Icon: SiFigma, color: "#F24E1E" },
      { name: "Framer", Icon: SiFramer, color: "#0055FF" },
    ],
  },
];

export function Skills() {
  const t = useTranslations("skills");

  return (
    <section id="skills" className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
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

        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((cat, catIdx) => {
            const CatIcon = cat.icon;
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: catIdx * 0.1 }}
                className={`rounded-xl p-6 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] transition-all duration-300 hover:border-purple-500/30 hover:shadow-[0_0_40px_rgba(124,58,237,0.08)] group ${cat.wide ? "md:col-span-2" : ""}`}
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `${readableAccent(cat.iconColor)}1A`,
                      border: `1px solid ${readableAccent(cat.iconColor)}33`,
                    }}
                  >
                    <CatIcon size={18} color={readableAccent(cat.iconColor)} />
                  </div>
                  <h3 className="font-heading font-semibold text-white/90">
                    {t(`categories.${cat.key}`)}
                  </h3>
                </div>

                {/*
                  The AI card carries a sentence as well as chips. Three chips
                  alone read as an empty section, which undercuts the one
                  category the page is meant to lead with.
                */}
                {cat.wide && (
                  <p className="mb-5 max-w-2xl text-sm leading-relaxed text-white/65">
                    {t("ai_blurb")}
                  </p>
                )}

                {/* Skill badges with icons */}
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, skillIdx) => {
                    const SkillIcon = skill.Icon;
                    const accent = readableAccent(skill.color);
                    return (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.3,
                          delay: catIdx * 0.1 + skillIdx * 0.04,
                          ease: "backOut",
                        }}
                        whileHover={{ scale: 1.06, y: -2 }}
                        // Label is neutral; only the icon carries the brand hue.
                        // Coloring the label was making several badges unreadable.
                        className="flex cursor-default items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white/80 transition-all duration-200"
                        style={{
                          background: `${accent}12`,
                          border: `1px solid ${accent}33`,
                        }}
                      >
                        <SkillIcon size={11} style={{ color: accent }} />
                        <span>{skill.name}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
