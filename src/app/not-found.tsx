import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#0A0A0F", color: "white" }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(124,58,237,0.18), transparent)",
        }}
      />

      {/* Blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-700/15 rounded-full blur-3xl animate-blob pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl animate-blob animation-delay-2000 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
        {/* 404 number */}
        <div className="relative mb-6 select-none">
          <p
            className="font-heading font-bold leading-none text-glitch"
            style={{
              fontSize: "clamp(7rem, 20vw, 11rem)",
              background: "linear-gradient(135deg, #7C3AED, #C084FC, #7C3AED)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              opacity: 0.9,
            }}
          >
            404
          </p>
          {/* Glow behind number */}
          <div
            className="absolute inset-0 pointer-events-none -z-10"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(124,58,237,0.3), transparent 60%)",
              filter: "blur(24px)",
            }}
          />
        </div>

        {/* Message */}
        <h1
          className="font-heading text-xl md:text-2xl font-semibold mb-3"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          This page got lost in the void
        </h1>
        <p
          className="text-sm leading-relaxed mb-10"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          Looks like this URL doesn&apos;t exist. Maybe it was deleted, moved,
          or never existed to begin with.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm text-white transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #A855F7)",
            boxShadow: "0 0 32px rgba(124,58,237,0.4)",
          }}
        >
          ← Back to home
        </Link>

        {/* Subtle footnote */}
        <p
          className="mt-8 text-xs font-mono"
          style={{ color: "rgba(255,255,255,0.15)" }}
        >
          linderhassinger.dev
        </p>
      </div>
    </main>
  );
}
