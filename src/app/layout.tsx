import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import en from "@/messages/en.json";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Linder Hassinger | AI Tech Lead & AI Consultant",
  description:
    "AI Tech Lead and consultant helping companies put AI into production, backed by 8+ years building production-grade web, mobile, and iOS software. Claude and OpenAI APIs, React, Next.js, TypeScript. Based in Lima, Peru, working globally.",
  keywords: [
    "Linder Hassinger",
    "linder hassinger developer",
    "linder hassinger portfolio",
    "linder3hs",
    "AI Tech Lead",
    "AI consultant",
    "AI consulting",
    "LLM integration consultant",
    "AI engineer",
    "Claude API developer",
    "OpenAI API developer",
    "AI consultant Peru",
    "Python developer",
    "Django developer",
    "Python Django expert",
    "Django consultant",
    "AI consultant Latin America",
    "Senior Software Developer",
    "Tech Lead",
    "Full Stack Engineer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "iOS Developer",
    "SwiftUI Developer",
    "Lima Peru developer",
    "Peru software engineer",
    "AI developer",
    "SNY streaming app",
    "FanDuel developer",
    "Lonely Planet developer",
    "freelance developer Peru",
  ],
  authors: [{ name: "Linder Hassinger", url: "https://linderhassinger.dev" }],
  creator: "Linder Hassinger",
  publisher: "Linder Hassinger",
  metadataBase: new URL("https://linderhassinger.dev"),
  alternates: {
    canonical: "/en",
    languages: {
      "en": "/en",
      "es": "/es",
      "x-default": "/en",
    },
  },
  openGraph: {
    type: "website",
    url: "https://linderhassinger.dev",
    title: "Linder Hassinger | AI Tech Lead & AI Consultant",
    description:
      "AI Tech Lead and consultant. I help companies get AI into production, backed by 8+ years building at scale — from Apple TV streaming apps to LLM-powered tools. Based in Lima, Peru.",
    siteName: "Linder Hassinger Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linder Hassinger | AI Tech Lead & AI Consultant",
    description:
      "AI Tech Lead and consultant. Putting AI into production for companies, on top of 8+ years of production engineering.",
    creator: "@linder3hs",
    site: "@linder3hs",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Linder Hassinger",
  url: "https://linderhassinger.dev",
  jobTitle: "AI Tech Lead & AI Consultant",
  description:
    "AI Tech Lead and consultant helping companies put AI into production, backed by 8+ years building production-grade web, mobile, and iOS software. Based in Lima, Peru, working globally.",
  image: "https://linderhassinger.dev/en/opengraph-image",
  sameAs: [
    "https://github.com/linder3hs",
    "https://linkedin.com/in/linderhassinger",
    "https://twitter.com/linder3hs",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lima",
    addressCountry: "PE",
  },
  knowsAbout: [
    "Artificial Intelligence",
    "AI Consulting",
    "LLM Integration",
    "Python",
    "Django",
    "Large Language Models",
    "Claude API",
    "OpenAI API",
    "AI Product Engineering",
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "SwiftUI",
    "iOS Development",
    "Full Stack Development",
    "Tech Leadership",
  ],
  worksFor: {
    "@type": "Organization",
    name: "WotDev",
  },
  // The real engagements, straight from the copy the Services section renders,
  // so the two can't drift apart.
  makesOffer: en.services.items.map((service) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: service.name,
      serviceType: "AI and software consulting",
      description: `${service.summary} ${service.outcome}`,
      areaServed: "Worldwide",
    },
  })),
};

/**
 * A second node for the consulting practice itself. Person answers "who is
 * Linder Hassinger"; this answers "who does AI consulting" — a different query
 * and a different entity, even though one person is behind both.
 */
const serviceLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://linderhassinger.dev/#practice",
  name: "Linder Hassinger — AI consulting",
  url: "https://linderhassinger.dev/en#services",
  description: en.services.subtitle,
  provider: { "@type": "Person", name: "Linder Hassinger" },
  areaServed: "Worldwide",
  availableLanguage: ["en", "es"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lima",
    addressCountry: "PE",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: en.services.title,
    itemListElement: en.services.items.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.name,
        description: service.summary,
      },
    })),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
        />
        {children}
      </body>
    </html>
  );
}
