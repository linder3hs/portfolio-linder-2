import { Footer } from '@/components/ui/Footer';
import { Navbar } from '@/components/ui/Navbar';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';

  /*
   * Without these, /es inherited the root layout's English title and
   * description — the Spanish result in Google was an English snippet. Child
   * routes (projects, writing) set their own and override this.
   */
  const title = isEs
    ? 'Linder Hassinger | Consultor de IA y AI Tech Lead'
    : 'Linder Hassinger | AI Tech Lead & AI Consultant';

  const description = isEs
    ? 'Consultor de IA y AI Tech Lead. Llevo IA a producción para empresas, con 9+ años construyendo software web, móvil e iOS. Python, Django, Claude y OpenAI API. Desde Lima, Perú.'
    : 'AI Tech Lead and consultant. I take AI to production for companies, backed by 9+ years building web, mobile, and iOS software. Python, Django, Claude and OpenAI APIs. Based in Lima, Peru.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        es: '/es',
        'x-default': '/en',
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}`,
      locale: isEs ? 'es_PE' : 'en_US',
      alternateLocale: isEs ? 'en_US' : 'es_PE',
    },
    twitter: { title, description },
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
  if (!routing.locales.includes(locale as 'en' | 'es')) notFound();

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
          {locale === 'es' ? 'Saltar al contenido' : 'Skip to content'}
        </a>
        <Navbar />
        <div id="content">{children}</div>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
