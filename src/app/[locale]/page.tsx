import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Hero } from "@/components/sections/Hero";
import { Clients } from "@/components/sections/Clients";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { AskLinder } from "@/components/ai/AskLinder";

function Divider() {
  return (
    <div
      aria-hidden
      className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
    />
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative">
      <Hero />
      {/* Proof, then the offer, before any of the biography. */}
      <Clients />
      <Divider />
      <Services />
      <Divider />
      <About />
      <Divider />
      <Skills />
      <Divider />
      <Projects />
      <Divider />
      <AskLinder />
      <Divider />
      <Experience />
      <Divider />
      <Contact />
    </main>
  );
}
