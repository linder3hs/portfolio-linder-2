"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FiGithub, FiLinkedin, FiMapPin, FiGlobe } from "react-icons/fi";
import { CountUp } from "@/components/ui/CountUp";

const stats = [
  { target: 8, suffix: "+", labelKey: "stats.years_label", color: "#7C3AED" },
  { target: 50, suffix: "+", labelKey: "stats.projects_label", color: "#A855F7" },
  { target: 20, suffix: "+", labelKey: "stats.technologies_label", color: "#C084FC" },
  { target: 3, suffix: "+", labelKey: "stats.ai_label", color: "#74AA9C" },
];

export function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gradient mb-4">
            {t("title")}
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-heading text-xl md:text-2xl text-white/75 leading-snug tracking-tight mb-8">
              {t("bio")}
            </p>

            {/* Location + Remote badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-white/60 cursor-default"
              >
                <FiMapPin className="text-purple-400" size={14} />
                {t("location")}
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-white/60 cursor-default"
              >
                <FiGlobe className="text-purple-400" size={14} />
                {t("remote")}
              </motion.span>
            </div>

            {/* Social links */}
            <div className="flex gap-4">
              <motion.a
                href="https://github.com/linder3hs"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 border border-white/20 hover:border-purple-500/50 rounded-full text-sm font-medium text-white/70 hover:text-white transition-all duration-300 glass hover:shadow-[0_0_20px_rgba(124,58,237,0.2)]"
              >
                <FiGithub size={16} />
                GitHub
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/linderhassinger"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 border border-white/20 hover:border-purple-500/50 rounded-full text-sm font-medium text-white/70 hover:text-white transition-all duration-300 glass hover:shadow-[0_0_20px_rgba(124,58,237,0.2)]"
              >
                <FiLinkedin size={16} />
                LinkedIn
              </motion.a>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.labelKey}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="relative rounded-xl p-6 text-center bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] transition-all duration-300 overflow-hidden group"
                style={{
                  boxShadow: `0 0 0 0 ${stat.color}00`,
                }}
              >
                {/* Background glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
                  style={{
                    background: `radial-gradient(circle at 50% 80%, ${stat.color}18, transparent 70%)`,
                  }}
                />
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-0 group-hover:w-3/4 transition-all duration-500 rounded-full"
                  style={{ background: stat.color }}
                />

                <div
                  className="relative z-10 font-heading text-4xl font-bold mb-2"
                  style={{ color: stat.color }}
                >
                  <CountUp target={stat.target} suffix={stat.suffix} />
                </div>
                <div className="relative z-10 text-white/50 text-sm">
                  {t(stat.labelKey)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
