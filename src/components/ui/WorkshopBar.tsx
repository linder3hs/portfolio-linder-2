"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { WORKSHOP_GROUP_URL } from "@/lib/site";

/**
 * One sticky bar instead of the hero banner repeated between sections: the
 * offer follows the reader through every section without pushing the actual
 * content apart, and it works on the projects/writing routes too, which have
 * no hero to copy the banner into.
 *
 * Appears past the fold so it never competes with the hero banner it mirrors.
 */
export function WorkshopBar() {
  const t = useTranslations("workshop");
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  // ponytail: dismissal lives in state, not storage — it comes back on the next
  // page load, which is the behaviour we want for a two-week promo anyway.
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 60 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-4 sm:pb-4"
        >
          <div className="relative mx-auto max-w-3xl">
            <div
              aria-hidden
              className="absolute -inset-px rounded-2xl bg-[linear-gradient(120deg,rgba(37,211,102,0.5),rgba(124,58,237,0.5),rgba(37,211,102,0.5))] opacity-60 blur-[2px]"
            />
            <div className="relative flex items-center gap-3 rounded-2xl bg-[#0b0b12]/95 px-4 py-3 backdrop-blur-xl sm:gap-4 sm:px-5">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-emerald-300">
                    <motion.span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                      animate={reduceMotion ? undefined : { opacity: [1, 0.25, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                    {t("badge")}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/45">
                    {t("date")}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm font-semibold text-white">
                  {t("title")}
                </p>
              </div>

              <a
                href={WORKSHOP_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-[#06251a] outline-none transition-all duration-300 hover:bg-[#1fbe5a] hover:shadow-[0_0_28px_rgba(37,211,102,0.45)] focus-visible:ring-2 focus-visible:ring-white/70 sm:px-5 sm:text-sm"
              >
                <SiWhatsapp size={15} />
                <span>{t("cta")}</span>
              </a>

              <button
                type="button"
                onClick={() => setDismissed(true)}
                aria-label={t("dismiss")}
                className="shrink-0 rounded-full p-1.5 text-white/40 outline-none transition-colors hover:bg-white/5 hover:text-white/80 focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
