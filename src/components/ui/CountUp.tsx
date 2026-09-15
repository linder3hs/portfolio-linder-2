"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  target: number;
  suffix?: string;
  duration?: number;
}

/**
 * Counts up to `target` the first time it scrolls into view.
 *
 * It renders the *final* value on the server and on first paint, and only
 * drops to 0 once the animation is actually about to run. The previous version
 * started at 0 and relied on an observer callback to ever leave it, so any
 * browser where that callback didn't fire — reduced motion, a hydration hiccup,
 * an element already in view at load — was left showing "0+" forever. The
 * failure mode now is "no animation", not "wrong number".
 */
export function CountUp({ target, suffix = "", duration = 1800 }: CountUpProps) {
  const [count, setCount] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const animate = () => {
      const startTime = performance.now();
      const tick = (now: number) => {
        // Ease out cubic.
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };

      setCount(0);
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        animate();
      },
      // A sliver of the number is enough; the card around it is already
      // animating in at this point.
      { rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}
