import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { projects } from "@/lib/projects";
import { posts } from "@/lib/posts";

const BASE_URL = "https://linderhassinger.dev";

/**
 * The hreflang alternates block for a path shared across locales. x-default is
 * what Google serves a visitor whose language matches neither.
 */
function alternates(path: string) {
  return {
    languages: {
      ...Object.fromEntries(
        routing.locales.map((locale) => [locale, `${BASE_URL}/${locale}${path}`]),
      ),
      "x-default": `${BASE_URL}/${routing.defaultLocale}${path}`,
    },
  };
}

type Entry = {
  path: string;
  priority: number;
  changeFrequency: "monthly" | "weekly";
  lastModified: Date;
};

export default function sitemap(): MetadataRoute.Sitemap {
  /*
   * Build time, used only for the pages that genuinely change when the site is
   * rebuilt. Stamping it on every URL — which is what this did — tells Google
   * the whole site changed on every deploy, and it stops trusting lastmod.
   */
  const buildDate = new Date();

  /** Newest post on the site: what the writing index actually last changed to. */
  const newestPost = posts.reduce(
    (latest, post) => (post.date > latest ? post.date : latest),
    posts[0]?.date ?? "",
  );

  const paths: Entry[] = [
    { path: "", priority: 1, changeFrequency: "monthly", lastModified: buildDate },
    {
      path: "/projects",
      priority: 0.9,
      changeFrequency: "weekly",
      lastModified: buildDate,
    },
    {
      path: "/writing",
      priority: 0.9,
      changeFrequency: "weekly",
      lastModified: new Date(newestPost || buildDate),
    },
    ...posts.map((post) => ({
      path: `/writing/${post.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
      lastModified: new Date(post.date),
    })),
    ...projects.map((project) => ({
      path: `/projects/${project.slug}`,
      priority: project.featured ? 0.8 : 0.6,
      changeFrequency: "monthly" as const,
      // ponytail: projects carry a year, not a date. Dec 31 of that year is
      // the honest upper bound; add a real `updated` field if one ever matters.
      lastModified: new Date(`${project.year}-12-31`),
    })),
  ];

  return routing.locales.flatMap((locale) =>
    paths.map(({ path, priority, changeFrequency, lastModified }) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified,
      changeFrequency,
      // The default locale is the canonical one, so it ranks slightly higher.
      priority: locale === routing.defaultLocale ? priority : priority - 0.1,
      alternates: alternates(path),
    })),
  );
}
