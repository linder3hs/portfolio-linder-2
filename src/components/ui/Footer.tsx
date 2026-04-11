"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FiGithub, FiLinkedin, FiArrowUp } from "react-icons/fi";

const navLinks = [
  { labelKey: "about",      href: "#about"      },
  { labelKey: "skills",     href: "#skills"     },
  { labelKey: "projects",   href: "#projects"   },
  { labelKey: "experience", href: "#experience" },
  { labelKey: "contact",    href: "#contact"    },
];

const socials = [
  { Icon: FiGithub,   href: "https://github.com/linder3hs",           label: "GitHub"   },
  { Icon: FiLinkedin, href: "https://linkedin.com/in/linderhassinger", label: "LinkedIn" },
];

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative border-t border-white/[0.06] overflow-hidden">
      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(124,58,237,0.6), transparent)",
        }}
      />
      <div
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-32 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(124,58,237,0.12), transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-16">
        {/* Main tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-heading text-2xl md:text-3xl font-semibold text-white/80 leading-snug mb-3">
            {t("tagline")}
          </p>
          <p className="text-white/35 text-sm max-w-sm mx-auto leading-relaxed">
            {t("subtagline")}
          </p>
        </motion.div>

        {/* Nav + socials row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-12"
        >
          {/* Nav links */}
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {navLinks.map((link) => (
              <a
                key={link.labelKey}
                href={link.href}
                className="text-white/35 hover:text-white/75 text-sm transition-colors duration-200"
              >
                {nav(link.labelKey)}
              </a>
            ))}
          </div>

          <div className="hidden sm:block w-px h-4 bg-white/10" />

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socials.map(({ Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="text-white/35 hover:text-white/75 transition-colors duration-200"
              >
                <Icon size={17} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent mb-8" />

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-white/20 text-xs font-mono text-center sm:text-left">
            © {new Date().getFullYear()} Linder Hassinger
            <span className="mx-2 text-purple-500/30">·</span>
            {t("made_in")}
          </p>

          {/* Back to top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 text-xs font-medium text-white/25 hover:text-white/60 transition-colors duration-200"
          >
            {t("back_top")}
            <FiArrowUp size={12} />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
}
