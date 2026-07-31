"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowDown } from "lucide-react";
import { SiReact, SiNextdotjs, SiOpenai, SiPython, SiDjango } from "react-icons/si";
import { TbBrain } from "react-icons/tb";
import { ctaHref, ctaLinkProps } from "@/lib/site";
import { readableAccent } from "@/lib/project-meta";
import { Typewriter } from "@/components/ui/AnimatedText";
import { HeroBackdrop } from "@/components/three/HeroBackdrop";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * AI first, then the platform stack. The two AI marks sit highest and largest
 * because they carry the positioning; the rest frame the headline.
 */
const floatingIcons = [
  { Icon: TbBrain, color: "#E09A78", style: { top: "15%", left: "8%" }, size: 34, label: "Claude" },
  { Icon: SiOpenai, color: "#7DD3C0", style: { top: "20%", right: "9%" }, size: 32, label: "OpenAI" },
  { Icon: SiPython, color: "#5B8DEF", style: { top: "52%", left: "5%" }, size: 26, label: "Python" },
  { Icon: SiDjango, color: readableAccent("#092E20"), style: { top: "60%", right: "6%" }, size: 26, label: "Django" },
  { Icon: SiReact, color: "#61DAFB", style: { bottom: "22%", left: "11%" }, size: 24, label: "React" },
  { Icon: SiNextdotjs, color: "#E5E7EB", style: { bottom: "26%", right: "12%" }, size: 24, label: "Next.js" },
];

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

export function Hero() {
  const t = useTranslations("hero");
  const reduceMotion = useReducedMotion();
  const roles = t.raw("roles") as string[];

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <HeroBackdrop />

      {/* Grid — the only static texture left; the depth now comes from the 3D field. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {floatingIcons.map(({ Icon, color, style, size, label }, i) => (
        <motion.div
          key={i}
          aria-hidden
          className="pointer-events-none absolute hidden md:block"
          style={style}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 + i * 0.15, duration: 0.5, ease: "backOut" }}
        >
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
            className="glass rounded-xl p-2.5"
            style={{ borderColor: `${color}40`, boxShadow: `0 0 24px ${color}18` }}
            title={label}
          >
            <Icon size={size} color={color} />
          </motion.div>
        </motion.div>
      ))}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-4xl px-4 text-center"
      >
        <motion.div variants={item} className="mb-4">
          <span className="glass inline-flex items-center gap-2 rounded-full border border-purple-400/25 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-purple-200">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" aria-hidden />
            {t("greeting")}
          </span>
        </motion.div>

        {/*
          The glitch animation is gone: it was applied to the one string on the
          page that has to stay legible.
        */}
        <motion.h1
          variants={item}
          className="font-heading mb-6 text-5xl font-bold leading-tight text-white md:text-7xl lg:text-8xl"
        >
          <span className="text-shimmer">{t("name")}</span>
        </motion.h1>

        <motion.div
          variants={item}
          className="font-heading mb-6 flex h-10 items-center justify-center text-xl md:text-3xl"
        >
          <Typewriter words={roles} />
        </motion.div>

        <motion.p
          variants={item}
          className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-white/60"
        >
          {t("subtitle")}
        </motion.p>

        {/*
          Contact is the primary action, not "view my work": this page exists to
          start conversations, and the work is one scroll away either way.
        */}
        <motion.div variants={item} className="flex flex-wrap justify-center gap-4">
          <MagneticButton
            href={ctaHref()}
            {...ctaLinkProps}
            className="group relative block overflow-hidden rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white outline-none transition-all duration-300 hover:bg-violet-500 hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <span className="relative z-10">{t("cta_contact")}</span>
          </MagneticButton>

          <MagneticButton
            href="#projects"
            className="gradient-border glass group relative block overflow-hidden rounded-full px-8 py-3.5 text-sm font-semibold text-white/85 outline-none transition-colors duration-300 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <span className="relative z-10">{t("cta_work")}</span>
          </MagneticButton>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
        >
          {[
            "Claude API",
            "Claude Code",
            "OpenAI API",
            "Python",
            "Django",
            "React",
            "Next.js",
            "TypeScript",
          ].map((tech) => (
            <span
              key={tech}
              className="glass rounded-full border border-white/[0.08] px-3 py-1 font-mono text-xs text-white/50"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        // Hidden on short viewports: with the AI stack added, the chip row
        // reaches this and the two collide at ~620px of viewport height, which
        // is what a 1366x768 laptop actually has once browser chrome is out.
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 [@media(max-height:700px)]:hidden"
      >
        <span className="font-mono text-xs tracking-widest text-white/40">SCROLL</span>
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/50"
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
