import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/** Locale-aware Link/router. Use these instead of next/link across the app. */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
