"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageToggle } from "./LanguageToggle";

const navLinks = [
  { key: "about", href: "#about" },
  { key: "skills", href: "#skills" },
  { key: "projects", href: "#projects" },
  { key: "experience", href: "#experience" },
  { key: "contact", href: "#contact" },
];

export function Navbar() {
  const t = useTranslations("nav");
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // Hide/show navbar
      if (currentY < 80) {
        setVisible(true);
      } else {
        setVisible(currentY < lastY);
      }
      setLastY(currentY);

      // Active section detection
      const offset = 120;
      const sections = navLinks.map(({ href }) => {
        const el = document.querySelector(href) as HTMLElement | null;
        return { id: href.slice(1), top: el ? el.offsetTop : 0 };
      });

      const scrollY = currentY + offset;
      let current = "";
      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollY >= sections[i].top) {
          current = sections[i].id;
          break;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY]);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/[0.06]"
          >
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
              <a
                href="#"
                className="font-heading font-bold text-xl text-gradient"
              >
                LH
              </a>

              {/* Desktop links */}
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.key;
                  return (
                    <a
                      key={link.key}
                      href={link.href}
                      className="relative text-sm font-medium transition-colors duration-200 group"
                      style={{ color: isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)" }}
                    >
                      {t(link.key)}
                      {/* Active dot indicator */}
                      <span
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full transition-all duration-300"
                        style={{
                          width: isActive ? 16 : 0,
                          height: 2,
                          background: "linear-gradient(to right, #7C3AED, #C084FC)",
                          opacity: isActive ? 1 : 0,
                        }}
                      />
                    </a>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                <LanguageToggle />
                <button
                  className="md:hidden text-white/70 hover:text-white transition-colors"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Toggle menu"
                >
                  {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="md:hidden border-t border-white/[0.06] backdrop-blur-xl bg-black/30"
                >
                  <div className="px-6 py-4 flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <a
                        key={link.key}
                        href={link.href}
                        onClick={handleLinkClick}
                        className="text-white/70 hover:text-white text-sm transition-colors duration-200 font-medium py-1"
                      >
                        {t(link.key)}
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
