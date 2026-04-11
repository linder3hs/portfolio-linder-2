"use client";

import { useState, useEffect } from "react";

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
  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);

  useEffect(() => {
    if (isPausing) return;

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
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, isPausing, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className="text-gradient font-heading">
      {displayed}
      <span className="animate-pulse text-purple-400 ml-0.5">|</span>
    </span>
  );
}
