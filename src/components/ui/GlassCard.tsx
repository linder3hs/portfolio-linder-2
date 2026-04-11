"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  animate?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = true,
  delay = 0,
  animate = true,
}: GlassCardProps) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { scale: 1.02 } : undefined}
      className={cn(
        "rounded-xl p-6",
        "bg-white/[0.03] backdrop-blur-xl",
        "border border-white/[0.08]",
        hover &&
          "transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
