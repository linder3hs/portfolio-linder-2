import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === "es";

  return {
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        es: "/es",
        "x-default": "/en",
      },
    },
    openGraph: {
      locale: isEs ? "es_PE" : "en_US",
      alternateLocale: isEs ? "en_US" : "es_PE",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "en" | "es")) notFound();

  // Opts the whole subtree into static rendering instead of per-request SSR.
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {/*
        ponytail: `lang` sits here rather than on <html> because the root layout
        is shared with the non-localized routes (robots, sitemap, 404) and can't
        read the locale. Move html/body into this layout if those ever go away.
      */}
      <div lang={locale} className="relative min-h-screen bg-background">
        <a
          href="#content"
          className="sr-only rounded-md bg-white px-4 py-2 text-sm font-semibold text-black focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]"
        >
          {locale === "es" ? "Saltar al contenido" : "Skip to content"}
        </a>
        <Navbar />
        <div id="content">{children}</div>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
