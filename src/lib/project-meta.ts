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

/**
 * Brand colors are picked to sit on white. On #0A0A0F several of them are
 * effectively invisible (Django #092E20, Prisma #2D3748). This raises lightness
 * to a floor so an icon stays recognisable without becoming unreadable.
 *
 * Icons only — body text uses a neutral, since a hue-shifted brand color is
 * never a reliable way to hit 4.5:1.
 */
export function readableAccent(hex: string, minLightness = 0.58): string {
  const m = /^#?([\da-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;

  const int = parseInt(m[1], 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (l >= minLightness) return hex;

  // Blend toward white by however much lightness is missing.
  const t = (minLightness - l) / (1 - l);
  const mix = (c: number) => Math.round((c + (1 - c) * t) * 255);
  return `#${[mix(r), mix(g), mix(b)]
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("")}`;
}
