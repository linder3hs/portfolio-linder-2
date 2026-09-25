"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, CalendarDays, GraduationCap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/calendar";
import { courses } from "@/lib/courses";
import { plans } from "@/lib/plans";
import { workshops } from "@/lib/workshops";

/**
 * The other half of what Linder sells: the consulting sections above are aimed
 * at companies, this one at developers. It sits after the proof and before the
 * contact form so it reads as a second door, not as a banner interrupting the
 * pitch — and it summarises /courses, /workshops and /plans rather than
 * repeating them.
 */
export function Community() {
  const t = useTranslations("community");
  const tw = useTranslations("workshops");
  const locale = useLocale();
  const isEs = locale === "es";
  const tag = isEs ? "es-PE" : "en-US";
  const reduceMotion = useReducedMotion();

  const entry = plans.reduce((cheapest, plan) =>
    plan.price < cheapest.price ? plan : cheapest,
  );

  const reveal = {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  return (
    <section id="community" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...reveal} className="mb-14 text-center">
          <span className="glass mb-6 inline-flex items-center rounded-full border border-purple-400/25 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-purple-200">
            {t("eyebrow")}
          </span>
          <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/60">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Courses first and full-width at md: the one offer with a deadline. */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.article
            {...reveal}
            className="glass flex flex-col rounded-2xl border border-white/[0.08] p-6 sm:p-7 md:col-span-2 lg:col-span-1"
          >
            <div className="mb-5 flex items-center gap-2">
              <GraduationCap size={15} className="text-purple-300" aria-hidden />
              <span className="font-mono text-[11px] uppercase tracking-widest text-white/50">
                {t("courses_label")}
              </span>
              <span className="ml-auto rounded-full bg-primary/20 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-purple-200">
                {t("starts", {
                  date: formatDate(courses[0].startDate, tag, { day: "numeric", month: "short" }),
                })}
              </span>
            </div>

            <ul className="space-y-3">
              {courses.map((course) => (
                <li
                  key={course.id}
                  className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] pb-3 last:border-0"
                >
                  <span className="min-w-0">
                    <span className="block font-semibold leading-snug text-white">
                      {isEs ? course.title.es : course.title.en}
                    </span>
                    <span className="mt-1 block font-mono text-[11px] text-white/45">
                      {isEs ? course.level.es : course.level.en} · {course.time}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-sm text-white/55">
                    S/ {course.price}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/courses"
              className="group mt-auto flex items-center gap-1.5 pt-6 text-sm font-medium text-purple-300 outline-none transition-colors hover:text-purple-200 focus-visible:ring-2 focus-visible:ring-white/60"
            >
              {t("see_courses")}
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </motion.article>

          <motion.article
            {...reveal}
            className="glass flex flex-col rounded-2xl border border-white/[0.08] p-6 sm:p-7"
          >
            <div className="mb-5 flex items-center gap-2">
              <CalendarDays size={15} className="text-purple-300" aria-hidden />
              <span className="font-mono text-[11px] uppercase tracking-widest text-white/50">
                {t("workshops_label")}
              </span>
              <span className="ml-auto rounded-full bg-emerald-400/15 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-emerald-300">
                {tw("free")}
              </span>
            </div>

            {workshops.length === 0 && (
              <p className="text-sm leading-relaxed text-white/55">{tw("empty")}</p>
            )}

            <ul className="space-y-4">
              {workshops.map((workshop) => (
                <li key={workshop.id} className="flex gap-4">
                  <span className="w-14 shrink-0 rounded-lg border border-purple-400/20 bg-primary/10 py-2 text-center">
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-purple-300">
                      {formatDate(workshop.date, tag, { month: "short" })}
                    </span>
                    <span className="font-heading block text-lg font-bold leading-tight text-white">
                      {formatDate(workshop.date, tag, { day: "numeric" })}
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold leading-snug text-white">
                      {isEs ? workshop.title.es : workshop.title.en}
                    </span>
                    <span className="mt-1 block font-mono text-[11px] text-white/45">
                      {workshop.time} · {tw("timezone")}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/workshops"
              className="group mt-auto flex items-center gap-1.5 pt-6 text-sm font-medium text-purple-300 outline-none transition-colors hover:text-purple-200 focus-visible:ring-2 focus-visible:ring-white/60"
            >
              {t("see_calendar")}
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </motion.article>

          <motion.article
            {...reveal}
            className="glass flex flex-col rounded-2xl border border-white/[0.08] p-6 sm:p-7"
          >
            <div className="mb-5 flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-white/50">
                {t("plans_label")}
              </span>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-white/40">
                {t("payment")}
              </span>
            </div>

            <p className="font-heading text-3xl font-bold text-white">
              {t("from_price", { price: entry.price })}
            </p>

            <ul className="mt-5 space-y-3">
              {plans.map((plan) => (
                <li
                  key={plan.id}
                  className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] pb-3 last:border-0"
                >
                  <span className="text-sm text-white/75">
                    {isEs ? plan.name.es : plan.name.en}
                    {plan.featured && (
                      <span className="ml-2 rounded-full bg-primary/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-purple-200">
                        {t("popular")}
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-sm text-white/55">S/ {plan.price}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/plans"
              className="group mt-auto flex items-center gap-1.5 pt-6 text-sm font-medium text-purple-300 outline-none transition-colors hover:text-purple-200 focus-visible:ring-2 focus-visible:ring-white/60"
            >
              {t("see_plans")}
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
