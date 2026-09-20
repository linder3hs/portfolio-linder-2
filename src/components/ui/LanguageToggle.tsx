"use client";

import { Globe } from "lucide-react";
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
      // Borderless next to the palette button and the CTA: three outlined
      // controls in a row read as a toolbar, which is not what this is.
      className="flex items-center gap-1 rounded-full px-2 py-1.5 text-white/55 outline-none transition-colors duration-300 hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-purple-400 disabled:opacity-50"
    >
      <Globe size={15} aria-hidden />
      <span className="font-mono text-[10px] font-semibold tracking-widest">
        {locale === "en" ? "ES" : "EN"}
      </span>
    </button>
  );
}
