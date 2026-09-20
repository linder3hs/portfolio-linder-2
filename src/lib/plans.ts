import type { Localized } from "./projects";
import data from "@/data/plans.json";

export interface Plan {
  id: string;
  /** Monthly, in PEN. Culqi charges in soles, so the page quotes soles. */
  price: number;
  featured?: boolean;
  /** Omitted when the plan has no cap. */
  seats?: number;
  soldOut?: boolean;
  name: Localized;
  tagline: Localized;
  perks: { en: string[]; es: string[] };
}

export const plans: Plan[] = data as Plan[];
