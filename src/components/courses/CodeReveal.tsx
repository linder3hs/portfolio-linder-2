"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Colours a line by what it is — prompt, comment, frontmatter key, list step,
 * output. Four prefixes cover both snippets; a real highlighter would be a
 * dependency for nine lines of text.
 */
function Line({ text }: { text: string }) {
  if (text === "") return <>&nbsp;</>;
  if (text.startsWith("$ "))
    return (
      <>
        <span className="text-(--accent)">$</span>
        <span className="text-white/90">{text.slice(1)}</span>
      </>
    );
  if (text.startsWith("#") || text === "---")
    return <span className="text-white/35">{text}</span>;

  const key = /^([a-z-]+:|\d+\.)(.*)$/.exec(text);
  if (key)
    return (
      <>
        <span className="text-(--accent)">{key[1]}</span>
        <span className="text-white/80">{key[2]}</span>
      </>
    );

  return <span className="text-white/55">{text}</span>;
}

/**
 * The hero's one moment of motion: the file arrives a line at a time, the way
 * the course says you'll write it. Plays once; with reduced motion it is simply
 * there.
 */
export function CodeReveal({
  file,
  lines,
  label,
}: {
  file: string;
  lines: string[];
  label: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <figure
      aria-label={label}
      className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d14] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
    >
      <figcaption className="flex items-center gap-2 border-b border-white/[0.07] px-5 py-3 font-mono text-xs text-white/45">
        <span aria-hidden className="h-2 w-2 rounded-full bg-(--accent)" />
        {file}
      </figcaption>
      <pre className="whitespace-pre-wrap break-words px-5 py-5 font-mono text-[12.5px] leading-7 sm:text-[13px]">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={reduceMotion ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.22, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <Line text={line} />
            {i === lines.length - 1 && (
              <span
                aria-hidden
                className="ml-1 inline-block h-4 w-2 translate-y-0.5 bg-(--accent) motion-safe:animate-[blink_1.1s_steps(1)_infinite]"
              />
            )}
          </motion.div>
        ))}
      </pre>
    </figure>
  );
}
