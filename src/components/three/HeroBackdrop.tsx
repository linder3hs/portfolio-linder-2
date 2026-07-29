"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

// three + r3f is ~150KB gzipped. It stays out of the initial bundle and never
// loads at all for visitors who asked for reduced motion.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export function HeroBackdrop() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  // Once mounted the canvas stays mounted — tearing down the WebGL context on
  // every scroll-past costs more than leaving it paused.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { threshold: 0.01 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Static fallback: also the backdrop behind the scene, so the hero never
          renders as a flat black rectangle while the chunk loads. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(124,58,237,0.28), transparent 70%), radial-gradient(ellipse 60% 50% at 15% 100%, rgba(168,85,247,0.12), transparent 65%)",
        }}
      />
      {!reduceMotion && mounted && <HeroScene active={inView} />}
    </div>
  );
}
