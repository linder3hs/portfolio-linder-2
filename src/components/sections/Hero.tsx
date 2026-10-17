"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Check, Video } from "lucide-react";
import { plans } from "@/lib/plans";
import { whatsappUrl } from "@/lib/site";
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
 * The home hero sells what is open right now: the 1:1 mentoring plan. Price,
 * seats and perks are read from plans.json, so the hero moves with the data.
 * The consulting pitch starts at Services.
 */
export function Hero() {
  const t = useTranslations("hero");
  const tp = useTranslations("plans");
  const isEs = useLocale() === "es";
  const locale = isEs ? "es" : "en";
  // ponytail: non-null on purpose — the hero is built around this plan, so
  // renaming its id should break the build, not quietly empty the hero.
  const mentoring = plans.find((plan) => plan.id === "mentoria")!;
  const name = mentoring.name[locale];

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
              {t("badge")}
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
              {t("lead")}
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
                href={whatsappUrl(tp("wa_message", { plan: name }))}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-primary px-6.5 text-[15px] font-semibold text-white outline-none transition-[background-color,box-shadow] duration-300 hover:bg-violet-500 hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] focus-visible:ring-2 focus-visible:ring-white/70"
              >
                {t("cta_book")}
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </MagneticButton>

              <MagneticButton
                href={`/${locale}/plans`}
                className="inline-flex h-13 items-center justify-center rounded-full border border-white/15 px-6 text-[15px] font-medium text-white outline-none transition-colors duration-300 hover:border-white/30 focus-visible:ring-2 focus-visible:ring-white/70"
              >
                {t("cta_plans")}
              </MagneticButton>
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

          <motion.section
            variants={item}
            aria-label={name}
            className="rounded-[18px] border border-white/[0.08] bg-[#111117] px-5 py-5 sm:rounded-[20px] sm:px-7 sm:py-6"
          >
            <p className="flex flex-wrap justify-between gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.06em] text-white/55 sm:text-xs">
              <span className="flex items-center gap-2">
                <Video size={15} strokeWidth={1.8} aria-hidden />
                {name}
              </span>
              {mentoring.seats !== undefined && (
                <span>{tp("seats", { seats: mentoring.seats })}</span>
              )}
            </p>

            <p className="mt-5 flex items-baseline gap-1.5">
              <span className="font-heading text-4xl font-semibold text-white">
                S/ {mentoring.price}
              </span>
              <span className="text-[13px] text-white/55">{tp("per_month")}</span>
            </p>

            <p className="mt-2.5 text-[14px] leading-relaxed text-white/60 sm:text-[15px]">
              {mentoring.tagline[locale]}
            </p>

            <ul className="mt-5 space-y-3 border-t border-white/[0.07] pt-5">
              {mentoring.perks[locale].map((perk) => (
                <li
                  key={perk}
                  className="flex gap-2.5 text-[13.5px] leading-relaxed text-white/70 sm:text-sm"
                >
                  <Check
                    size={15}
                    strokeWidth={2.2}
                    className="mt-0.5 shrink-0 text-[#A99BFA]"
                    aria-hidden
                  />
                  {perk}
                </li>
              ))}
            </ul>

            <p className="mt-5 border-t border-white/[0.07] pt-4 text-[12.5px] text-white/55 sm:text-[13px]">
              {t("payment")}
            </p>
          </motion.section>
        </div>
      </motion.div>
    </section>
  );
}
