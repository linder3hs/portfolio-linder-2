"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

interface TypewriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function Typewriter({
  words,
  typingSpeed = 80,
  deletingSpeed = 50,
  pauseDuration = 2000,
}: TypewriterProps) {
  const reduceMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);

  useEffect(() => {
    if (isPausing || reduceMotion) return;

    const current = words[wordIndex % words.length];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          const next = current.substring(0, displayed.length + 1);
          setDisplayed(next);
          if (next === current) {
            setIsPausing(true);
            setTimeout(() => {
              setIsPausing(false);
              setIsDeleting(true);
            }, pauseDuration);
          }
        } else {
          const next = current.substring(0, displayed.length - 1);
          setDisplayed(next);
          if (next === "") {
            setIsDeleting(false);
            setWordIndex((i) => i + 1);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed,
    );

    return () => clearTimeout(timeout);
  }, [
    displayed,
    isDeleting,
    isPausing,
    wordIndex,
    words,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    reduceMotion,
  ]);

  // Reduced motion gets the roles as static text instead of an endless loop.
  if (reduceMotion) {
    return (
      <span className="text-gradient font-heading">{words.join(" · ")}</span>
    );
  }

  return (
    <>
      {/*
        The visible text mutates character by character; announcing that is
        noise. Screen readers get the full list once instead.
      */}
      <span className="text-gradient font-heading" aria-hidden>
        {displayed}
        <span className="ml-0.5 animate-pulse text-purple-300">|</span>
      </span>
      <span className="sr-only">{words.join(", ")}</span>
    </>
  );
}
