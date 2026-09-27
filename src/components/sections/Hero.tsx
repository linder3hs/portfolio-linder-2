"use client";

import { useRef, type CSSProperties } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Check, Video } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/calendar";
import { courses, pick } from "@/lib/courses";
import { plans } from "@/lib/plans";
import { Logo } from "@/components/ui/Logo";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function MagneticButton({
  children,
  href,
  className,
  ...rest
}: {
  children: React.ReactNode;
  href: string;
  className: string;
  // Narrow on purpose: spreading all anchor props collides with framer-motion's
  // own onDrag/onAnimationStart signatures.
  target?: string;
  rel?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={reduceMotion ? undefined : { x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={className}
      {...rest}
    >
      {children}
    </motion.a>
  );
}

/**
 * The home hero is a billboard for what is open right now: the two live
 * courses, listed like the evening's schedule, and the 1:1 mentoring plan.
 * Times, prices, seats and the start date all come from the course and plan
 * data, so the hero moves with them. The consulting pitch starts at Services.
 */
export function Hero() {
  const t = useTranslations("hero");
  const tc = useTranslations("courses");
  const tp = useTranslations("plans");
  const locale = useLocale();
  const tag = locale === "es" ? "es-PE" : "en-US";
  const includes = t.raw("includes") as string[];
  // Same night, back to back: sorted by start time, the list reads as the schedule.
  const evening = [...courses].sort((a, b) => a.time.localeCompare(b.time));
  const weeks = pick(evening[0].syllabus, locale).length;
  const mentoring = plans.find((plan) => plan.id === "mentoria");

  return (
    <section id="hero" className="relative flex min-h-screen flex-col overflow-hidden pt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6"
      >
        <div className="grid flex-1 content-center items-center gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:py-16">
          <div className="flex flex-col items-start">
            <motion.p
              variants={item}
              className="inline-flex h-8 items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 font-mono text-[11px] uppercase tracking-[0.06em] text-zinc-300 sm:text-xs"
            >
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-green-400" />
              {t("badge", {
                date: formatDate(evening[0].startDate, tag, { day: "numeric", month: "short" }),
              })}
            </motion.p>

            <motion.h1
              variants={item}
              className="font-heading mt-6 text-[length:min(2.625rem,10.5vw)] font-semibold leading-[1.04] tracking-[-0.035em] text-white sm:text-6xl lg:mt-7 lg:text-5xl xl:text-6xl"
            >
              {t("title_1")}
              <br />
              <span className="text-[#A99BFA]">{t("title_2")}</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-5 max-w-[34rem] text-base leading-relaxed text-white/60 sm:text-lg lg:mt-6"
            >
              {t("lead", { weeks })}
            </motion.p>

            <motion.div
              variants={item}
              className="mt-7 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:gap-3 lg:mt-9"
            >
              {/*
                ponytail: plain anchors with the locale written in, so they keep
                the magnetic motion.a. Costs a full page load instead of a
                client-side transition; swap for motion.create(Link) if that
                ever shows.
              */}
              <MagneticButton
                href={`/${locale}/courses`}
                className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-primary px-6.5 text-[15px] font-semibold text-white outline-none transition-[background-color,box-shadow] duration-300 hover:bg-violet-500 hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] focus-visible:ring-2 focus-visible:ring-white/70"
              >
                {t("cta_courses")}
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </MagneticButton>

              {mentoring && (
                <MagneticButton
                  href={`/${locale}/plans#${mentoring.id}`}
                  className="inline-flex h-13 items-center justify-center rounded-full border border-white/15 px-6 text-[15px] font-medium text-white outline-none transition-colors duration-300 hover:border-white/30 focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  {t("cta_mentoring")}
                </MagneticButton>
              )}
            </motion.div>

            <motion.div variants={item} className="mt-8 flex items-center gap-3.5 lg:mt-11">
              <span
                aria-hidden
                className="flex size-11 shrink-0 items-center justify-center rounded-full border border-purple-400/35 bg-[#14111F]"
              >
                <Logo size={22} />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-white">{t("by_name")}</span>
                <span className="text-[13px] text-white/55">{t("by_detail")}</span>
              </span>
            </motion.div>
          </div>

          <motion.div variants={item} className="flex flex-col gap-3 sm:gap-4">
            <section
              aria-label={t("courses_label")}
              className="rounded-[18px] border border-white/[0.08] bg-[#111117] px-5 pb-4.5 pt-5 sm:rounded-[20px] sm:px-7 sm:pb-5 sm:pt-6"
            >
              <p className="flex flex-wrap justify-between gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.06em] text-white/55 sm:text-xs">
                <span>{t("schedule")}</span>
                <span>{t("length", { weeks, sessions: evening[0].sessions })}</span>
              </p>

              <ul className="mt-4 sm:mt-4.5">
                {evening.map((course) => (
                  <li key={course.id} className="border-t border-white/[0.07]">
                    <Link
                      href={`/courses/${course.id}`}
                      style={{ "--accent": course.accent } as CSSProperties}
                      className="group grid grid-cols-[3.25rem_minmax(0,1fr)] items-start gap-x-3.5 rounded-lg py-4.5 outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:gap-x-4.5 sm:py-5"
                    >
                      <span className="font-heading text-[19px] font-semibold leading-snug text-(--accent) sm:text-2xl sm:leading-tight">
                        {course.time}
                      </span>
                      <span className="flex min-w-0 flex-col gap-1.5">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-(--accent) sm:text-[11px]">
                          {pick(course.level, locale)}
                        </span>
                        <span className="font-heading text-[17px] font-semibold tracking-[-0.01em] text-white transition-colors duration-300 group-hover:text-purple-100 sm:text-[19px]">
                          {pick(course.title, locale)}
                        </span>
                        <span className="text-[13.5px] leading-relaxed text-white/60 sm:text-sm">
                          {pick(course.tagline, locale)}
                        </span>
                      </span>
                      <span className="col-start-2 mt-2 flex items-baseline gap-2 sm:col-start-3 sm:row-start-1 sm:mt-0 sm:flex-col sm:items-end sm:gap-0.5">
                        <span className="font-heading text-[17px] font-semibold text-white sm:text-xl">
                          S/ {course.price}
                        </span>
                        <s aria-hidden className="text-[12.5px] text-white/55 sm:text-[13px]">
                          S/ {course.regularPrice}
                        </s>
                        <span className="sr-only">
                          {tc("regular_price", { price: course.regularPrice })}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-white/[0.07] pt-3.5 text-[12.5px] text-white/55 sm:pt-4 sm:text-[13px]">
                <span>{t("price_note")}</span>
                <span>{t("builders")}</span>
              </p>
            </section>

            {/*
              One grid, two arrangements: on a phone the description drops to
              its own full-width row and the seats sit under the name; from sm
              up the description sits under the name and the seats under the
              price.
            */}
            {mentoring && (
              <Link
                href={`/plans#${mentoring.id}`}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-3.5 rounded-[18px] border border-white/[0.08] bg-[#111117] px-5 py-4.5 outline-none transition-colors duration-300 hover:border-white/15 focus-visible:ring-2 focus-visible:ring-white/70 sm:gap-x-4.5 sm:rounded-[20px] sm:px-6 sm:py-5"
              >
                <span
                  aria-hidden
                  className="col-1 row-[1/3] flex size-10 items-center justify-center self-center rounded-[11px] bg-white/5 text-zinc-300 sm:size-11 sm:rounded-xl"
                >
                  <Video size={20} strokeWidth={1.8} />
                </span>
                <span className="font-heading col-2 row-1 self-end text-[17px] font-semibold text-white">
                  {pick(mentoring.name, locale)}
                </span>
                <span className="col-[1/-1] row-3 mt-3 text-[13.5px] leading-relaxed text-white/60 sm:col-2 sm:row-2 sm:mt-1 sm:leading-normal">
                  {t("mentoring_body")}
                </span>
                <span className="font-heading col-3 row-[1/3] self-center justify-self-end text-[17px] font-semibold text-white sm:row-1 sm:self-end sm:text-lg">
                  S/ {mentoring.price}
                  <span className="font-sans text-[12.5px] font-normal text-white/55 sm:text-[13px]">
                    {tp("per_month")}
                  </span>
                </span>
                {mentoring.seats !== undefined && (
                  <span className="col-2 row-2 mt-0.5 self-start font-mono text-[10.5px] uppercase tracking-[0.08em] text-white/55 sm:col-3 sm:mt-1 sm:justify-self-end sm:text-[11px]">
                    {tp("seats", { seats: mentoring.seats })}
                  </span>
                )}
              </Link>
            )}
          </motion.div>
        </div>

        <motion.ul
          variants={item}
          className="flex flex-col gap-3 border-t border-white/[0.06] py-6 text-[13.5px] text-white/60 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-7 lg:gap-y-2 lg:text-[13px] lg:text-white/55"
        >
          {includes.map((line) => (
            <li key={line} className="flex items-center gap-2.5 lg:gap-2">
              <Check size={15} strokeWidth={2.2} className="shrink-0 text-[#A99BFA]" aria-hidden />
              {line}
            </li>
          ))}
          <li className="mt-1 text-[12.5px] text-white/55 lg:ml-auto lg:mt-0 lg:text-[13px]">
            {t("payment")}
          </li>
        </motion.ul>
      </motion.div>
    </section>
  );
}
