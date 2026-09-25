import type { Localized } from "./projects";
import data from "@/data/courses.json";

export interface Course {
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
  level: Localized;
  title: Localized;
  summary: Localized;
  /** One entry per week. */
  syllabus: { en: { title: string; body: string }[]; es: { title: string; body: string }[] };
  finalProject: Localized;
  requires: Localized;
}

export const courses: Course[] = data as Course[];
