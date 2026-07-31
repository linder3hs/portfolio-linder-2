"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, Check } from "lucide-react";
import { ctaHref, ctaLinkProps } from "@/lib/site";

type Service = {
  name: string;
  duration: string;
  summary: string;
  bullets: string[];
  outcome: string;
};

/**
 * The missing half of the pitch: skills and experience say what Linder can do,
 * this says what a visitor can actually buy and what they walk away with.
 *
 * ponytail: no prices — they are a business decision, not a code one. Add a
 * `price` field per item here and one line in the card when they are set.
 */
export function Services() {
  const t = useTranslations("services");
  const reduceMotion = useReducedMotion();
  const items = t.raw("items") as Service[];

  return (
    <section id="services" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="glass mb-6 inline-flex items-center rounded-full border border-purple-400/25 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-purple-200">
            {t("eyebrow")}
          </span>
          <h2 className="font-heading text-gradient mb-4 text-3xl font-bold md:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/60">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {items.map((service, i) => (
            <motion.article
              key={service.name}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors duration-300 hover:border-purple-400/35"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-purple-300">
                {service.duration}
              </span>

              <h3 className="font-heading mt-3 text-xl font-bold text-white">
                {service.name}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {service.summary}
              </p>

              <ul className="mt-5 flex flex-col gap-2.5">
                {service.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5 text-sm text-white/70">
                    <Check
                      size={14}
                      aria-hidden
                      className="mt-0.5 shrink-0 text-purple-400"
                    />
                    {bullet}
                  </li>
                ))}
              </ul>

              <p className="mt-auto pt-6 text-sm font-medium text-white/85">
                {service.outcome}
              </p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex flex-col items-center gap-4 text-center"
        >
          <a
            href={ctaHref()}
            {...ctaLinkProps}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white outline-none transition-all duration-300 hover:bg-violet-500 hover:shadow-[0_0_30px_rgba(124,58,237,0.45)] focus-visible:ring-2 focus-visible:ring-white/70"
          >
            {t("cta")}
            <ArrowRight size={15} aria-hidden />
          </a>
          <p className="max-w-md text-xs leading-relaxed text-white/50">
            {t("note")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
