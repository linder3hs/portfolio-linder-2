import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="relative min-h-screen" style={{ backgroundColor: "#0A0A0F" }}>
      {/* Global effects */}
      <ParticleBackground />
      <CursorGlow />

      <div className="relative z-10">
        <Navbar />
        <Hero />

        {/* Gradient divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

        <About />

        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

        <Skills />

        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

        <Projects />

        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

        <Experience />

        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

        <Contact />

        <Footer />
      </div>
    </main>
  );
}
