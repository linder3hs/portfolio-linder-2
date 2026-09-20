import type { Localized } from "./projects";
import data from "@/data/workshops.json";

export interface Workshop {
  id: string;
  /** `YYYY-MM-DD`, Lima time. Never parsed as a local Date — see lib/calendar. */
  date: string;
  /** `HH:MM`, 24h, Lima time. */
  time: string;
  durationMin: number;
  level: Localized;
  title: Localized;
  summary: Localized;
  topics: string[];
}

/**
 * ponytail: a JSON file, not a database. Two workshops a month is a file the
 * owner edits in the same PR as the page; swap for a CMS when someone other
 * than him needs to publish one.
 */
export const workshops: Workshop[] = [...(data as Workshop[])].sort((a, b) =>
  a.date.localeCompare(b.date),
);

/** Distinct `{year, month}` pairs, in order — one mini calendar each. */
export function workshopMonths(list: Workshop[] = workshops) {
  const seen = new Set<string>();
  return list.flatMap((workshop) => {
    const key = workshop.date.slice(0, 7);
    if (seen.has(key)) return [];
    seen.add(key);
    const [year, month] = key.split("-").map(Number);
    return [{ key, year, month }];
  });
}
