import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ProjectGrid } from "@/components/projects/ProjectGrid";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });

  return {
    title: `${t("index_title")} | Linder Hassinger`,
    description: t("index_subtitle"),
    alternates: {
      canonical: `/${locale}/projects`,
      languages: {
        en: "/en/projects",
        es: "/es/projects",
        "x-default": "/en/projects",
      },
    },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "projects" });

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <header className="mb-12">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-purple-300">
          {t("index_eyebrow")}
        </p>
        <h1 className="font-heading mt-3 text-4xl font-bold text-white md:text-5xl">
          {t("index_title")}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/60">
          {t("index_subtitle")}
        </p>
      </header>

      <ProjectGrid />
    </main>
  );
}
