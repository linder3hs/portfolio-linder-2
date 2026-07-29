"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface CountUpProps {
  target: number;
  suffix?: string;
  duration?: number;
}

export function CountUp({ target, suffix = "", duration = 1800 }: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reduceMotion = useReducedMotion();
  const started = useRef(false);

  useEffect(() => {
    if (!isInView || started.current || reduceMotion) return;
    started.current = true;

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, target, duration, reduceMotion]);

  return (
    <span ref={ref}>
      {/* Reduced motion shows the final number rather than ticking up to it. */}
      {reduceMotion ? target : count}
      {suffix}
    </span>
  );
}
