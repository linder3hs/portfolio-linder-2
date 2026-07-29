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
      type="button"
      onClick={switchLocale}
      disabled={isPending}
      lang={locale === "en" ? "es" : "en"}
      aria-label={locale === "en" ? "Cambiar idioma a español" : "Switch language to English"}
      className="rounded-full border border-white/20 px-3 py-1.5 font-mono text-xs font-semibold tracking-widest text-white/75 outline-none transition-all duration-300 hover:border-purple-400/50 hover:text-white focus-visible:ring-2 focus-visible:ring-purple-400 disabled:opacity-50"
    >
      {locale === "en" ? "ES" : "EN"}
    </button>
  );
}
