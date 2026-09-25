import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { CodeReveal } from "@/components/courses/CodeReveal";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { addDays, addMinutes, formatDate } from "@/lib/calendar";
import { courses, getCourse, pick } from "@/lib/courses";
import { whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    courses.map((course) => ({ locale, slug: course.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};

  const title = pick(course.title, locale);
  const description = pick(course.summary, locale);

  return {
    title: `${title} | Linder Hassinger`,
    description,
    alternates: {
      canonical: `/${locale}/courses/${slug}`,
      languages: {
        en: `/en/courses/${slug}`,
        es: `/es/courses/${slug}`,
        "x-default": `/en/courses/${slug}`,
      },
    },
    openGraph: { title, description },
  };
}

/** Opacity of each class segment: the live block is the one that matters. */
const SEGMENT_TONES = ["bg-(--accent)/35", "bg-(--accent)", "bg-(--accent)/60"];

export default async function CoursePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const course = getCourse(slug);
  if (!course) notFound();

  const t = await getTranslations({ locale, namespace: "courses" });
  const tag = locale === "es" ? "es-PE" : "en-US";
  const title = pick(course.title, locale);
  const end = addMinutes(course.time, course.durationMin);
  const syllabus = pick(course.syllabus, locale);
  const format = pick(course.format, locale);
  const includes = t.raw("includes") as string[];
  const reserveHref = whatsappUrl(t("wa_message", { course: title }));
  const other = courses.find((c) => c.id !== course.id);

  const reserveButton = (
    <a
      href={reserveHref}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-(--accent) px-6 py-3 text-sm font-semibold text-[#0A0A0F] outline-none transition-opacity duration-300 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/70"
    >
      <SiWhatsapp size={16} aria-hidden />
      {t("cta")}
    </a>
  );

  return (
    <main style={{ "--accent": course.accent } as CSSProperties} className="pb-24 pt-28">
      {/* Hero */}
      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-28 h-[520px] bg-[radial-gradient(ellipse_60%_60%_at_75%_0%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded text-sm text-white/55 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <ArrowLeft size={14} aria-hidden />
            {t("back")}
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-medium text-(--accent)">{pick(course.level, locale)}</p>
              <h1 className="font-heading mt-3 text-5xl font-bold leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
                {title}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/65">
                {pick(course.summary, locale)}
              </p>

              <dl className="mt-9 grid max-w-xl grid-cols-1 gap-5 border-t border-white/10 pt-6 sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-white/45">{t("starts_label")}</dt>
                  <dd className="font-heading mt-1 text-lg font-semibold text-white">
                    {formatDate(course.startDate, tag, {
                      day: "numeric",
                      month: "short",
                    })}
                  </dd>
                  <dd className="text-xs text-white/45">
                    {formatDate(course.startDate, tag, { weekday: "long" })}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-white/45">{t("schedule_label")}</dt>
                  <dd className="font-heading mt-1 text-lg font-semibold text-white">
                    {course.time} – {end}
                  </dd>
                  <dd className="text-xs text-white/45">{t("schedule_days")}</dd>
                </div>
                <div>
                  <dt className="text-xs text-white/45">{t("length_label")}</dt>
                  <dd className="font-heading mt-1 text-lg font-semibold text-white">
                    {t("length_value", { weeks: syllabus.length })}
                  </dd>
                  <dd className="text-xs text-white/45">
                    {t("length_detail", {
                      sessions: course.sessions,
                      hours: course.hours,
                    })}
                  </dd>
                </div>
              </dl>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                {reserveButton}
                <p className="text-sm text-white/55">
                  <span className="font-heading text-2xl font-bold text-white">
                    S/ {course.price}
                  </span>{" "}
                  <s aria-hidden className="text-white/35">
                    S/ {course.regularPrice}
                  </s>
                  <span className="sr-only">
                    {t("regular_price", { price: course.regularPrice })}
                  </span>
                </p>
                <a
                  href="#syllabus"
                  className="rounded text-sm text-white/55 underline-offset-4 outline-none hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  {t("see_syllabus")}
                </a>
              </div>
            </div>

            <CodeReveal
              label={t("snippet_label")}
              file={pick(course.snippet, locale).file}
              lines={pick(course.snippet, locale).lines}
            />
          </div>
        </div>
      </section>

      {/* The three promises from the PDF cover */}
      <section className="mx-auto mt-24 grid max-w-6xl gap-8 px-6 sm:grid-cols-3">
        {pick(course.highlights, locale).map((item) => (
          <div key={item.title} className="border-t-2 border-(--accent) pt-5">
            <h2 className="font-heading text-xl font-bold text-white">{item.title}</h2>
            <p className="mt-2 leading-relaxed text-white/60">{item.body}</p>
          </div>
        ))}
      </section>

      {/* Syllabus: a real sequence, so a dated timeline */}
      <section id="syllabus" className="mx-auto mt-28 max-w-4xl scroll-mt-28 px-6">
        <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
          {t("syllabus_title")}
        </h2>
        <p className="mt-3 text-white/50">{t("syllabus_note")}</p>

        <ol className="relative mt-12 ml-1.5 border-l border-white/10">
          {syllabus.map((week, i) => (
            <li key={week.title} className="relative pb-11 pl-8 last:pb-0 sm:pl-10">
              <span
                aria-hidden
                className={cn(
                  "absolute -left-[6.5px] top-1.5 h-3 w-3 rounded-full border-2 border-(--accent)",
                  week.tag
                    ? "bg-(--accent) shadow-[0_0_0_6px_color-mix(in_oklab,var(--accent)_20%,transparent)]"
                    : "bg-[#0A0A0F]",
                )}
              />
              <p className="flex flex-wrap items-baseline gap-x-3 text-sm">
                <span className="font-semibold text-(--accent)">{t("week", { n: i + 1 })}</span>
                <span className="text-white/40">
                  {formatDate(addDays(course.startDate, i * 7), tag, {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </p>
              <h3 className="font-heading mt-1.5 text-xl font-bold leading-snug text-white md:text-2xl">
                {week.title}
                {week.tag && (
                  <span className="ml-3 inline-block translate-y-[-3px] rounded-full bg-(--accent)/15 px-2.5 py-1 align-middle font-sans text-xs font-semibold text-(--accent)">
                    {week.tag}
                  </span>
                )}
              </h3>
              <p className="mt-2 max-w-2xl leading-relaxed text-white/60">{week.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* One class, drawn to scale */}
      <section className="mx-auto mt-28 max-w-4xl px-6">
        <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
          {t("format_title")}
        </h2>
        <p className="mt-3 text-white/50">{t("format_subtitle", { start: course.time, end })}</p>

        <div aria-hidden className="mt-10 flex h-3 gap-1 overflow-hidden rounded-full">
          {format.map((part, i) => (
            <div
              key={part.label}
              style={{ flexGrow: part.min }}
              className={cn("basis-0", SEGMENT_TONES[i % SEGMENT_TONES.length])}
            />
          ))}
        </div>
        <ul className="mt-6 grid gap-6 sm:grid-cols-3">
          {format.map((part, i) => (
            <li key={part.label} className="flex gap-3">
              <span
                aria-hidden
                className={cn(
                  "mt-2 h-2.5 w-2.5 shrink-0 rounded-full",
                  SEGMENT_TONES[i % SEGMENT_TONES.length],
                )}
              />
              <span>
                <span className="font-heading block text-2xl font-bold text-white">
                  {t("minutes", { minutes: part.min })}
                </span>
                <span className="text-sm text-white/55">{part.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Outcome and entry bar */}
      <section className="mx-auto mt-28 grid max-w-6xl gap-10 px-6 md:grid-cols-2">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">{t("final_project")}</h2>
          <p className="mt-3 text-lg leading-relaxed text-white/65">
            {pick(course.finalProject, locale)}
          </p>
        </div>
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">{t("requires")}</h2>
          <p className="mt-3 text-lg leading-relaxed text-white/65">
            {pick(course.requires, locale)}
          </p>
        </div>
      </section>

      {/* Price: the one raised surface on the page */}
      <section id="reserve" className="mx-auto mt-28 max-w-6xl px-6">
        <div className="grid gap-10 rounded-3xl border border-(--accent)/30 bg-gradient-to-br from-(--accent)/15 via-(--accent)/[0.04] to-transparent p-8 md:p-12 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
              {t("price_title")}
            </h2>
            <p className="mt-3 max-w-md leading-relaxed text-white/60">{t("price_note")}</p>

            <p className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-heading text-6xl font-bold tracking-tight text-white md:text-7xl">
                S/ {course.price}
              </span>
              <s aria-hidden className="text-lg text-white/35">
                S/ {course.regularPrice}
              </s>
              <span className="sr-only">{t("regular_price", { price: course.regularPrice })}</span>
            </p>
            <p className="mt-2 text-white/55">
              {t("installments", { amount: course.installment })}
            </p>

            <div className="mt-8">{reserveButton}</div>

            <p className="mt-6 text-sm leading-relaxed text-white/50">
              {t.rich("builders", {
                link: (chunks) => (
                  <Link
                    href="/plans"
                    className="rounded text-white/80 underline underline-offset-4 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    {chunks}
                  </Link>
                ),
              })}{" "}
              {t("payment_note")}
            </p>
          </div>

          <div className="lg:border-l lg:border-white/10 lg:pl-10">
            <h3 className="font-heading text-lg font-bold text-white">{t("includes_one")}</h3>
            <ul className="mt-5 space-y-3.5">
              {includes.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-white/70">
                  <Check size={18} className="mt-0.5 shrink-0 text-(--accent)" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-8 border-t border-white/10 pt-6 text-sm leading-relaxed text-white/55">
              {t.rich("instructor", {
                b: (chunks) => <strong className="font-semibold text-white">{chunks}</strong>,
                link: (chunks) => (
                  <a
                    href="https://www.youtube.com/@linder3hs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded text-white/80 underline underline-offset-4 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>
        </div>
      </section>

      {/* The other half of the same night */}
      {other && (
        <section className="mx-auto mt-10 max-w-6xl px-6">
          <Link
            href={`/courses/${other.id}`}
            style={{ "--accent": other.accent } as CSSProperties}
            className="group flex items-center justify-between gap-6 rounded-3xl border border-white/[0.08] px-7 py-6 outline-none transition-colors duration-300 hover:border-(--accent)/50 focus-visible:ring-2 focus-visible:ring-white/70 md:px-10 md:py-8"
          >
            <span>
              <span className="block text-sm text-white/50">
                {t(other.time > course.time ? "other_later" : "other_earlier", {
                  time: other.time,
                })}
              </span>
              <span className="font-heading mt-1 block text-2xl font-bold text-(--accent) md:text-3xl">
                {pick(other.title, locale)}
              </span>
            </span>
            <ArrowRight
              size={22}
              className="shrink-0 text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white"
              aria-hidden
            />
          </Link>
        </section>
      )}
    </main>
  );
}
