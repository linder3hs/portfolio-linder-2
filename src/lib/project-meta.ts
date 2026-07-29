import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNodedotjs,
  SiPrisma, SiPostgresql, SiSupabase, SiFramer, SiOpenai, SiExpo,
  SiDocker, SiGithub,
} from "react-icons/si";
import { TbBrandFramerMotion, TbBrain, TbChartLine, TbCode, TbWorld } from "react-icons/tb";
import type { IconType } from "react-icons";
import type { ProjectCategory } from "./projects";

export const techIconMap: Record<string, { Icon: IconType; color: string }> = {
  "React":              { Icon: SiReact,              color: "#61DAFB" },
  "Next.js":            { Icon: SiNextdotjs,          color: "#E5E7EB" },
  "TypeScript":         { Icon: SiTypescript,         color: "#5B8DEF" },
  "Tailwind CSS":       { Icon: SiTailwindcss,        color: "#22D3EE" },
  "Framer Motion":      { Icon: TbBrandFramerMotion,  color: "#F472B6" },
  "Node.js":            { Icon: SiNodedotjs,          color: "#4ADE80" },
  "Prisma":             { Icon: SiPrisma,             color: "#818CF8" },
  "PostgreSQL":         { Icon: SiPostgresql,         color: "#60A5FA" },
  "Supabase":           { Icon: SiSupabase,           color: "#3ECF8E" },
  "Framer":             { Icon: SiFramer,             color: "#60A5FA" },
  "Claude API":         { Icon: SiOpenai,             color: "#7DD3C0" },
  "OpenAI API":         { Icon: SiOpenai,             color: "#7DD3C0" },
  "Claude Code":        { Icon: TbBrain,              color: "#E09A78" },
  "Expo":               { Icon: SiExpo,               color: "#E5E7EB" },
  "Docker":             { Icon: SiDocker,             color: "#60A5FA" },
  "GitHub API":         { Icon: SiGithub,             color: "#E5E7EB" },
  "Monaco Editor":      { Icon: TbCode,               color: "#93C5FD" },
  "Recharts":           { Icon: TbChartLine,          color: "#67E8F9" },
  "Open Trivia DB API": { Icon: TbWorld,              color: "#C4B5FD" },
};

/**
 * Per-category accent. Colors are picked to clear 4.5:1 against the #0A0A0F
 * background when used as text — the old palette did not.
 */
export const categoryMeta: Record<
  ProjectCategory,
  { color: string; glyph: string }
> = {
  ai:        { color: "#7DD3C0", glyph: "◆" },
  fullstack: { color: "#C084FC", glyph: "▲" },
  devtools:  { color: "#FBBF24", glyph: "■" },
  frontend:  { color: "#22D3EE", glyph: "●" },
  backend:   { color: "#4ADE80", glyph: "◇" },
};

export function metaFor(category: ProjectCategory) {
  return categoryMeta[category] ?? categoryMeta.fullstack;
}
