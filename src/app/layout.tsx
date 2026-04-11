import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
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
  title: "Linder Hassinger | Senior Software Developer & Tech Lead",
  description:
    "Senior Software Developer & Tech Lead with 8+ years building production-grade web, mobile, and AI-powered applications. React, Next.js, TypeScript specialist based in Lima, Peru.",
  keywords: [
    "Linder Hassinger",
    "linder hassinger developer",
    "linder hassinger portfolio",
    "linder3hs",
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
    title: "Linder Hassinger | Senior Software Developer & Tech Lead",
    description:
      "Senior Software Developer & Tech Lead with 8+ years building at scale — from Apple TV streaming apps to AI-powered tools. Based in Lima, Peru.",
    siteName: "Linder Hassinger Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linder Hassinger | Senior Software Developer & Tech Lead",
    description:
      "Senior Software Developer & Tech Lead with 8+ years building at scale. React, Next.js, TypeScript & AI specialist.",
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
  jobTitle: "Senior Software Developer & Tech Lead",
  description:
    "Senior Software Developer & Tech Lead with 8+ years building production-grade web, mobile, and AI-powered applications. React, Next.js, TypeScript specialist based in Lima, Peru.",
  image: "https://linderhassinger.dev/og-image.png",
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
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "SwiftUI",
    "iOS Development",
    "Full Stack Development",
    "AI Development",
    "Tech Leadership",
  ],
  worksFor: {
    "@type": "Organization",
    name: "WotDev",
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
        {children}
      </body>
    </html>
  );
}
