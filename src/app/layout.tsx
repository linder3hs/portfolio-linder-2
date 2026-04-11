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
    "Senior Software Developer",
    "Tech Lead",
    "Full Stack Engineer",
    "React",
    "Next.js",
    "TypeScript",
    "Lima Peru",
    "AI developer",
  ],
  authors: [{ name: "Linder Hassinger", url: "https://linderhassinger.dev" }],
  creator: "Linder Hassinger",
  metadataBase: new URL("https://linderhassinger.dev"),
  alternates: {
    canonical: "/",
    languages: {
      "en": "/en",
      "es": "/es",
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
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
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
      <body className="min-h-full bg-background text-white">{children}</body>
    </html>
  );
}
