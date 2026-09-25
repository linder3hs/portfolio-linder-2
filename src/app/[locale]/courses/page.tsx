import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, CalendarDays, Check, Clock, Radio } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { addMinutes, formatDate } from "@/lib/calendar";
import { courses } from "@/lib/courses";
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

  return {
    title: `${t("title")} | Linder Hassinger`,
    description: t("subtitle"),
    alternates: {
      canonical: `/${locale}/courses`,
      languages: { en: "/en/courses", es: "/es/courses", "x-default": "/en/courses" },
    },
  };
}

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "courses" });
  const isEs = locale === "es";
  const tag = isEs ? "es-PE" : "en-US";
  const includes = t.raw("includes") as string[];

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <header className="mx-auto mb-14 max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-purple-300">
          {t("eyebrow")}
        </p>
        <h1 className="font-heading mt-3 text-4xl font-bold text-white md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-white/60">{t("subtitle")}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((course) => {
          const title = isEs ? course.title.es : course.title.en;
          const syllabus = isEs ? course.syllabus.es : course.syllabus.en;
          // ponytail: same checkout as /plans — a prefilled WhatsApp message,
          // paid by Yape or Plin in the chat.
          const href = whatsappUrl(t("wa_message", { course: title }));

          return (
            <article
              key={course.id}
              className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-7"
            >
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white/55">
                  <Radio size={11} aria-hidden />
                  {t("live")}
                </span>
                <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white/55">
                  {isEs ? course.level.es : course.level.en}
                </span>
                <span className="rounded-full bg-primary/20 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-purple-200">
                  {t("first_cohort")}
                </span>
              </div>

              <h2 className="font-heading text-2xl font-bold leading-snug text-white md:text-3xl">
                {title}
              </h2>
              <p className="mt-3 leading-relaxed text-white/65">
                {isEs ? course.summary.es : course.summary.en}
              </p>

              <ul className="mt-5 space-y-2 font-mono text-xs text-white/55">
                <li className="flex items-center gap-2">
                  <CalendarDays size={13} className="text-purple-300" aria-hidden />
                  {t("starts", {
                    date: formatDate(course.startDate, tag, {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    }),
                  })}
                </li>
                <li className="flex items-center gap-2">
                  <Clock size={13} className="text-purple-300" aria-hidden />
                  {t("schedule")} · {course.time} – {addMinutes(course.time, course.durationMin)} ·{" "}
                  {t("timezone")}
                </li>
                <li className="pl-[21px]">
                  {t("load", { sessions: course.sessions, hours: course.hours })}
                </li>
              </ul>

              <div className="mt-6 rounded-xl border border-purple-400/20 bg-primary/[0.07] p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-purple-200/80">
                  {t("launch_price")}
                </p>
                <p className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-heading text-4xl font-bold text-white">
                    S/ {course.price}
                  </span>
                  <s className="font-mono text-sm text-white/40">S/ {course.regularPrice}</s>
                </p>
                <p className="mt-1 text-sm text-white/55">
                  {t("installments", { amount: course.installment })}
                </p>
              </div>

              <h3 className="mt-7 font-mono text-[11px] uppercase tracking-widest text-white/45">
                {t("syllabus", { weeks: syllabus.length })}
              </h3>
              <ol className="mt-3 divide-y divide-white/[0.06]">
                {syllabus.map((week, i) => (
                  <li key={week.title} className="flex gap-3 py-3">
                    <span className="w-6 shrink-0 font-mono text-xs text-purple-300">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-white/90">
                        {week.title}
                      </span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-white/50">
                        {week.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>

              <dl className="mt-4 space-y-4 border-t border-white/[0.07] pt-5 text-sm leading-relaxed">
                <div>
                  <dt className="font-semibold text-white/85">{t("final_project")}</dt>
                  <dd className="mt-1 text-white/55">
                    {isEs ? course.finalProject.es : course.finalProject.en}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-white/85">{t("requires")}</dt>
                  <dd className="mt-1 text-white/55">
                    {isEs ? course.requires.es : course.requires.en}
                  </dd>
                </div>
              </dl>

              <div className="mt-auto pt-7">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-[#06251a] outline-none transition-all duration-300 hover:bg-[#1fbe5a] hover:shadow-[0_0_32px_rgba(37,211,102,0.45)] focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  <SiWhatsapp size={15} aria-hidden />
                  {t("cta")}
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </a>
              </div>
            </article>
          );
        })}
      </div>

      <section className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
          <h2 className="font-heading text-lg font-bold text-white">{t("includes_title")}</h2>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {includes.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed text-white/65">
                <Check size={16} className="mt-0.5 shrink-0 text-purple-300" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-white/[0.07] pt-4 text-xs leading-relaxed text-white/45">
            {t("session_format")}
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 text-sm leading-relaxed text-white/60">
          <p>{t("back_to_back")}</p>
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
          <p className="mt-auto font-mono text-[11px] uppercase tracking-widest text-white/40">
            {t("payment_methods")}
          </p>
        </div>
      </section>
    </main>
  );
}
