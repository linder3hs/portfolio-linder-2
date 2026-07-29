import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getPost, posts, sortedPosts } from "@/lib/posts";
import { PostBody } from "@/components/writing/PostBody";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    posts.map((post) => ({ locale, slug: post.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const isEs = locale === "es";
  return {
    title: `${isEs ? post.title.es : post.title.en} | Linder Hassinger`,
    description: isEs ? post.excerpt.es : post.excerpt.en,
    alternates: {
      canonical: `/${locale}/writing/${slug}`,
      languages: {
        en: `/en/writing/${slug}`,
        es: `/es/writing/${slug}`,
        "x-default": `/en/writing/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      title: isEs ? post.title.es : post.title.en,
      description: isEs ? post.excerpt.es : post.excerpt.en,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPost(slug);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "writing" });
  const isEs = locale === "es";

  const index = sortedPosts.findIndex((p) => p.slug === slug);
  const next = sortedPosts[(index + 1) % sortedPosts.length];

  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-32">
      <Link
        href="/writing"
        className="inline-flex items-center gap-2 rounded text-sm text-white/60 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <ArrowLeft size={14} aria-hidden />
        {t("back_to_all")}
      </Link>

      <article className="mt-8">
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

        <h1 className="font-heading mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
          {isEs ? post.title.es : post.title.en}
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-white/65">
          {isEs ? post.excerpt.es : post.excerpt.en}
        </p>

        <PostBody body={isEs ? post.body.es : post.body.en} />
      </article>

      <nav className="mt-20 border-t border-white/10 pt-8">
        <Link
          href={`/writing/${next.slug}`}
          className="group flex flex-wrap items-center justify-between gap-3 rounded outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-white/50">
            {t("next_post")}
          </span>
          <span className="font-heading flex items-center gap-2 text-base font-bold text-white/80 transition-colors group-hover:text-white">
            {isEs ? next.title.es : next.title.en}
            <ArrowUpRight size={16} aria-hidden />
          </span>
        </Link>
      </nav>
    </main>
  );
}
