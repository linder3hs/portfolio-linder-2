"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

/**
 * The strongest sales asset on the site was buried at the bottom of the
 * Experience timeline. Names only — no logos, which would need licensing and
 * six image requests to say the same thing.
 */
const CLIENTS = [
  "SNY",
  "FanDuel",
  "Madison Square Garden",
  "Lonely Planet",
  "Tecsup",
];

export function Clients() {
  const t = useTranslations("clients");

  return (
    <section aria-label={t("title")} className="px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-5xl text-center"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/45">
          {t("title")}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {CLIENTS.map((name) => (
            <span
              key={name}
              className="font-heading text-base font-semibold tracking-tight text-white/55 transition-colors duration-300 hover:text-white/85 md:text-lg"
            >
              {name}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
