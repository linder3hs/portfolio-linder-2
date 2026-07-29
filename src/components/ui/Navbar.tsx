"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageToggle } from "./LanguageToggle";

const sectionLinks = [
  { key: "about", id: "about" },
  { key: "skills", id: "skills" },
  { key: "projects", id: "projects" },
  { key: "experience", id: "experience" },
  { key: "contact", id: "contact" },
];

/**
 * Tracks which section is in view. IntersectionObserver instead of a scroll
 * handler: no per-event layout reads, and the listener is registered once.
 */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!enabled) return;

    const elements = sectionLinks
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let best = "";
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        if (bestRatio > 0) setActive(best);
      },
      {
        // Discount the area behind the fixed navbar so a section isn't "active"
        // while it's still hidden under it.
        rootMargin: "-64px 0px -35% 0px",
        threshold: [0, 0.15, 0.35, 0.6, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);

  return active;
}

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useActiveSection(isHome);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    restDelta: 0.001,
  });

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-heading text-gradient rounded text-xl font-bold outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          aria-label="Linder Hassinger — home"
        >
          LH
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {sectionLinks.map(({ key, id }) => {
            const isActive = isHome && activeSection === id;
            const href = isHome ? `#${id}` : `/#${id}`;
            const className =
              "relative rounded text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/60";
            const style = {
              color: isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.62)",
            };
            const indicator = (
              <span
                aria-hidden
                className="absolute -bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-full transition-all duration-300"
                style={{
                  width: isActive ? 16 : 0,
                  background: "linear-gradient(to right, #7C3AED, #C084FC)",
                  opacity: isActive ? 1 : 0,
                }}
              />
            );

            return isHome ? (
              <a
                key={key}
                href={href}
                className={className}
                style={style}
                aria-current={isActive ? "true" : undefined}
              >
                {t(key)}
                {indicator}
              </a>
            ) : (
              <Link key={key} href={href} className={className} style={style}>
                {t(key)}
                {indicator}
              </Link>
            );
          })}

          <Link
            href="/writing"
            className="rounded text-sm font-medium text-white/62 outline-none transition-colors duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {t("writing")}
          </Link>

          <Link
            href="/projects"
            className="rounded-full border border-white/12 px-3.5 py-1.5 text-sm font-medium text-white/70 outline-none transition-colors duration-200 hover:border-purple-400/40 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {t("all_projects")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <button
            type="button"
            className="rounded text-white/75 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={t("toggle_menu")}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/[0.07] bg-black/50 backdrop-blur-xl md:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-1 px-6 py-4">
              {sectionLinks.map(({ key, id }) =>
                isHome ? (
                  <a
                    key={key}
                    href={`#${id}`}
                    onClick={closeMenu}
                    className="rounded py-2 text-sm font-medium text-white/75 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    {t(key)}
                  </a>
                ) : (
                  <Link
                    key={key}
                    href={`/#${id}`}
                    onClick={closeMenu}
                    className="rounded py-2 text-sm font-medium text-white/75 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    {t(key)}
                  </Link>
                ),
              )}
              <Link
                href="/writing"
                onClick={closeMenu}
                className="rounded py-2 text-sm font-medium text-white/75 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
              >
                {t("writing")}
              </Link>
              <Link
                href="/projects"
                onClick={closeMenu}
                className="mt-2 rounded border-t border-white/[0.07] pt-3 text-sm font-medium text-purple-300 outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                {t("all_projects")}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left"
        style={{
          scaleX: progress,
          background: "linear-gradient(to right, #7C3AED, #C084FC)",
        }}
      />
    </header>
  );
}
