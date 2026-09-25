import type { Localized } from "./projects";
import data from "@/data/courses.json";

type PerLocale<T> = { en: T; es: T };

export interface Course {
  /** Also the URL slug: /courses/{id}. */
  id: string;
  /** `YYYY-MM-DD`, Lima time. Format with lib/calendar, never `new Date()`. */
  startDate: string;
  /** `HH:MM`, 24h, Lima time. Tuesdays and Thursdays. */
  time: string;
  durationMin: number;
  sessions: number;
  hours: number;
  /** Launch price for the whole course, in PEN. */
  price: number;
  regularPrice: number;
  /** Each of the two installments, in PEN. */
  installment: number;
  /** The course's own colour, taken from its PDF. Drives `--accent`. */
  accent: string;
  level: Localized;
  title: Localized;
  summary: Localized;
  /** The three cards on the PDF cover. */
  highlights: PerLocale<{ title: string; body: string }[]>;
  /** What the hero panel types out: a terminal or a file. */
  snippet: PerLocale<{ file: string; lines: string[] }>;
  /** How one class splits, in minutes. */
  format: PerLocale<{ min: number; label: string }[]>;
  /** One entry per week. `tag` marks a week worth pointing at. */
  syllabus: PerLocale<{ title: string; body: string; tag?: string }[]>;
  finalProject: Localized;
  requires: Localized;
}

export const courses: Course[] = data as Course[];

export function getCourse(slug: string): Course | undefined {
  return courses.find((course) => course.id === slug);
}

/** The value for a `{ en, es }` pair — every course field is one. */
export function pick<T>(value: PerLocale<T>, locale: string): T {
  return locale === "es" ? value.es : value.en;
}
