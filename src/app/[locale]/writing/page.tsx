import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { sortedPosts } from "@/lib/posts";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "writing" });

  return {
    title: `${t("index_title")} | Linder Hassinger`,
    description: t("index_subtitle"),
    alternates: {
      canonical: `/${locale}/writing`,
      languages: { en: "/en/writing", es: "/es/writing", "x-default": "/en/writing" },
    },
  };
}

export default async function WritingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "writing" });
  const isEs = locale === "es";

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <header className="mb-14">
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

      <ul className="space-y-10">
        {sortedPosts.map((post) => (
          <li
            key={post.slug}
            className="group relative border-b border-white/[0.07] pb-10 last:border-0"
          >
            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-white/50">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString(isEs ? "es-PE" : "en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span aria-hidden>·</span>
              <span>{t("reading_time", { minutes: post.readingMinutes })}</span>
            </div>

            <h2 className="font-heading mt-2 text-xl font-bold leading-snug text-white md:text-2xl">
              <Link
                href={`/writing/${post.slug}`}
                className="rounded outline-none after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:ring-white/60"
              >
                {isEs ? post.title.es : post.title.en}
              </Link>
            </h2>

            <p className="mt-3 leading-relaxed text-white/65">
              {isEs ? post.excerpt.es : post.excerpt.en}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-white/60"
                >
                  {tag}
                </span>
              ))}
              <span className="ml-auto flex items-center gap-1 text-sm font-medium text-purple-300 transition-transform group-hover:translate-x-0.5">
                {t("read")}
                <ArrowUpRight size={14} aria-hidden />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
