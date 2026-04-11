"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = () => {
    const next = locale === "en" ? "es" : "en";
    // Replace the locale prefix in the current path
    const segments = pathname.split("/");
    segments[1] = next;
    const newPath = segments.join("/");
    startTransition(() => router.replace(newPath));
  };

  return (
    <button
      onClick={switchLocale}
      disabled={isPending}
      className="px-3 py-1.5 text-xs font-mono font-semibold border border-white/20 hover:border-purple-500/50 rounded-full transition-all duration-300 text-white/70 hover:text-white disabled:opacity-50 tracking-widest"
    >
      {locale === "en" ? "ES" : "EN"}
    </button>
  );
}
