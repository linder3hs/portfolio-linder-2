"use client";

import { motion, type Variants, useMotionValue, useSpring } from "framer-motion";
import { useTranslations } from "next-intl";
import { Typewriter } from "@/components/ui/AnimatedText";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiPython,
} from "react-icons/si";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const floatingIcons = [
  { Icon: SiReact, color: "#61DAFB", top: "15%", left: "8%", delay: 0, size: 28 },
  { Icon: SiNextdotjs, color: "#ffffff", top: "25%", right: "10%", delay: 1.2, size: 26 },
  { Icon: SiTypescript, color: "#3178C6", top: "65%", left: "5%", delay: 0.6, size: 24 },
  { Icon: SiTailwindcss, color: "#06B6D4", bottom: "25%", right: "7%", delay: 1.8, size: 26 },
  { Icon: SiNodedotjs, color: "#339933", top: "75%", left: "12%", delay: 2.4, size: 22 },
  { Icon: SiPython, color: "#3776AB", top: "40%", right: "5%", delay: 0.9, size: 22 },
];

const codeSnippets = [
  { text: "const dev = 'Linder';", top: "18%", left: "3%", delay: 1 },
  { text: "npm run build ✓", top: "55%", right: "2%", delay: 2.5 },
  { text: "<Portfolio />", bottom: "20%", left: "2%", delay: 0.5 },
  { text: "git push origin main", top: "80%", right: "3%", delay: 3 },
  { text: "type Dev = 'awesome'", top: "8%", right: "15%", delay: 1.8 },
];

function MagneticButton({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
    >
      {children}
    </motion.a>
  );
}

export function Hero() {
  const t = useTranslations("hero");
  const roles = t.raw("roles") as string[];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-700/20 rounded-full blur-3xl animate-blob pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-fuchsia-700/15 rounded-full blur-3xl animate-blob animation-delay-4000 pointer-events-none" />

      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(124, 58, 237, 0.3), transparent)",
        }}
      />

      {/* Orbit rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          className="orbit-ring absolute"
          style={{ width: 600, height: 600, top: -300, left: -300 }}
        />
        <div
          className="orbit-ring-reverse absolute"
          style={{ width: 800, height: 800, top: -400, left: -400 }}
        />
      </div>

      {/* Floating tech icons */}
      {floatingIcons.map(({ Icon, color, delay, size, ...pos }, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none hidden md:flex items-center justify-center"
          style={{ ...pos }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 1.5, duration: 0.5, ease: "backOut" }}
        >
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
            className="relative"
          >
            {/* Glow ring behind icon */}
            <div
              className="absolute inset-0 rounded-full blur-md opacity-40"
              style={{ background: color, transform: "scale(1.8)" }}
            />
            <div
              className="relative z-10 p-2.5 rounded-xl glass"
              style={{ border: `1px solid ${color}30` }}
            >
              <Icon size={size} color={color} />
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* Floating code snippets */}
      {codeSnippets.map((snippet, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none hidden lg:block"
          style={{ ...Object.fromEntries(Object.entries(snippet).filter(([k]) => ["top","left","right","bottom"].includes(k))) }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0.2, 0.35, 0] }}
          transition={{
            delay: snippet.delay,
            duration: 10,
            repeat: Infinity,
            repeatDelay: 3 + i * 2,
          }}
        >
          <div className="font-mono text-xs text-purple-300/40 glass px-3 py-1.5 rounded-lg whitespace-nowrap">
            {snippet.text}
          </div>
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        <motion.div variants={item} className="mb-4">
          <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-mono text-purple-300 tracking-widest uppercase border border-purple-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {t("greeting")}
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white leading-tight text-glitch"
        >
          <span className="text-shimmer">{t("name")}</span>
        </motion.h1>

        <motion.div
          variants={item}
          className="text-xl md:text-3xl font-heading mb-6 h-10 flex items-center justify-center"
        >
          <Typewriter words={roles} />
        </motion.div>

        <motion.p
          variants={item}
          className="text-white/50 text-lg mb-10 max-w-xl mx-auto leading-relaxed"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          variants={item}
          className="flex gap-4 justify-center flex-wrap"
        >
          <MagneticButton
            href="#projects"
            className="relative px-8 py-3.5 bg-primary hover:bg-violet-500 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] text-white overflow-hidden group block"
          >
            <span className="relative z-10">{t("cta_work")}</span>
            {/* shimmer sweep on hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </MagneticButton>

          <MagneticButton
            href="#contact"
            className="relative px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 text-white/80 hover:text-white overflow-hidden group block gradient-border glass"
          >
            <span className="relative z-10">{t("cta_contact")}</span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
          </MagneticButton>
        </motion.div>

        {/* Tech badge row */}
        <motion.div
          variants={item}
          className="mt-12 flex items-center justify-center gap-3 flex-wrap"
        >
          {["React", "Next.js", "TypeScript", "Node.js"].map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2 + i * 0.1, duration: 0.4, ease: "backOut" }}
              className="text-xs font-mono text-white/30 glass px-3 py-1 rounded-full border border-white/[0.06]"
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <span className="text-white/20 text-xs font-mono tracking-widest">SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/30"
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
