import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Check } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { addMinutes, formatDate } from "@/lib/calendar";
import { courses, pick } from "@/lib/courses";
import { whatsappUrl } from "@/lib/site";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "courses" });
  const date = formatDate(courses[0].startDate, locale === "es" ? "es-PE" : "en-US", {
    day: "numeric",
    month: "long",
  });

  return {
    title: `${t("meta_title")} | Linder Hassinger`,
    description: t("meta_description", { date }),
    alternates: {
      canonical: `/${locale}/courses`,
      languages: {
        en: "/en/courses",
        es: "/es/courses",
        "x-default": "/en/courses",
      },
    },
  };
}

export default async function CoursesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "courses" });
  const tag = locale === "es" ? "es-PE" : "en-US";
  const includes = t.raw("includes") as string[];
  // Same night, back to back: sorting by start time is what makes the strip read left to right.
  const evening = [...courses].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <header className="max-w-3xl">
        <h1 className="font-heading text-5xl font-bold leading-[1.02] tracking-tight text-white md:text-7xl">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
          {t("subtitle", {
            date: formatDate(evening[0].startDate, tag, {
              day: "numeric",
              month: "long",
            }),
          })}
        </p>
      </header>

      {/*
        The night itself is the index: one block per course, sized by its
        length, in the order they run. It is also the fastest way into each
        landing.
      */}
      <section aria-label={t("schedule_caption")} className="mt-16">
        <div className="flex gap-1.5">
          {evening.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              style={
                {
                  "--accent": course.accent,
                  flexGrow: course.durationMin,
                } as CSSProperties
              }
              className="group min-w-0 basis-0 rounded-2xl border border-(--accent)/40 bg-(--accent)/10 px-4 py-4 outline-none transition-colors duration-300 hover:bg-(--accent)/20 focus-visible:ring-2 focus-visible:ring-white/70 sm:px-6 sm:py-5"
            >
              <span className="block font-mono text-xs text-(--accent) sm:text-sm">
                {course.time} – {addMinutes(course.time, course.durationMin)}
              </span>
              <span className="font-heading mt-1 block text-base font-bold leading-tight text-white sm:text-2xl">
                {pick(course.title, locale)}
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-3 text-xs text-white/40">{t("schedule_caption")}</p>
      </section>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {evening.map((course) => {
          const title = pick(course.title, locale);

          return (
            <article
              key={course.id}
              style={{ "--accent": course.accent } as CSSProperties}
              className="relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 md:p-9"
            >
              <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-(--accent)" />

              <p className="text-sm font-medium text-(--accent)">{pick(course.level, locale)}</p>
              <h2 className="font-heading mt-2 text-3xl font-bold leading-tight text-white md:text-4xl">
                {title}
              </h2>
              <p className="mt-4 leading-relaxed text-white/65">{pick(course.summary, locale)}</p>

              <ul className="mt-6 space-y-2.5">
                {pick(course.highlights, locale).map((item) => (
                  <li key={item.title} className="flex gap-2.5 text-sm leading-relaxed">
                    <Check size={16} className="mt-0.5 shrink-0 text-(--accent)" aria-hidden />
                    <span>
                      <span className="font-semibold text-white">{item.title}.</span>{" "}
                      <span className="text-white/55">{item.body}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <div className="border-t border-white/[0.08] pt-6">
                  <p className="text-xs text-white/45">{t("launch_price")}</p>
                  <p className="mt-1 flex flex-wrap items-baseline gap-x-3">
                    <span className="font-heading text-4xl font-bold text-white">
                      S/ {course.price}
                    </span>
                    <s aria-hidden className="text-sm text-white/40">
                      S/ {course.regularPrice}
                    </s>
                    <span className="sr-only">
                      {t("regular_price", { price: course.regularPrice })}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-white/50">
                    {t("installments", { amount: course.installment })}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/courses/${course.id}`}
                    className="group inline-flex items-center gap-2 rounded-full bg-(--accent) px-5 py-2.5 text-sm font-semibold text-[#0A0A0F] outline-none transition-opacity duration-300 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    {t("view_course")}
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                  <a
                    href={whatsappUrl(t("wa_message", { course: title }))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 outline-none transition-colors duration-300 hover:border-white/30 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    <SiWhatsapp size={15} aria-hidden />
                    {t("cta")}
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <section className="mt-16 grid gap-10 border-t border-white/[0.08] pt-12 md:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">{t("includes_title")}</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {includes.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-white/65">
                <Check size={16} className="mt-0.5 shrink-0 text-purple-300" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 text-sm leading-relaxed text-white/55 md:pt-12">
          <p>
            {t.rich("builders", {
              link: (chunks) => (
                <Link
                  href="/plans"
                  className="rounded text-purple-300 underline-offset-4 hover:text-purple-200 hover:underline focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
          <p>{t("payment_note")}</p>
        </div>
      </section>
    </main>
  );
}
