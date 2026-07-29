import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { projects } from "@/lib/projects";

const BASE_URL = "https://linderhassinger.dev";

/** Builds the hreflang alternates block for a path shared across locales. */
function alternates(path: string) {
  return {
    languages: Object.fromEntries(
      routing.locales.map((locale) => [locale, `${BASE_URL}/${locale}${path}`]),
    ),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const paths: Array<{ path: string; priority: number; changeFrequency: "monthly" | "weekly" }> = [
    { path: "", priority: 1, changeFrequency: "monthly" },
    { path: "/projects", priority: 0.9, changeFrequency: "weekly" },
    ...projects.map((project) => ({
      path: `/projects/${project.slug}`,
      priority: project.featured ? 0.8 : 0.6,
      changeFrequency: "monthly" as const,
    })),
  ];

  return routing.locales.flatMap((locale) =>
    paths.map(({ path, priority, changeFrequency }) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified,
      changeFrequency,
      // The default locale is the canonical one, so it ranks slightly higher.
      priority: locale === routing.defaultLocale ? priority : priority - 0.1,
      alternates: alternates(path),
    })),
  );
}
