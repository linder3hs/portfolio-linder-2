import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check, Sparkles } from "lucide-react";
import { routing } from "@/i18n/routing";
import { plans } from "@/lib/plans";
import { CONTACT_EMAIL } from "@/lib/site";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "plans" });

  return {
    title: `${t("title")} | Linder Hassinger`,
    description: t("subtitle"),
    alternates: {
      canonical: `/${locale}/plans`,
      languages: { en: "/en/plans", es: "/es/plans", "x-default": "/en/plans" },
    },
  };
}

export default async function PlansPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "plans" });
  const isEs = locale === "es";

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <header className="mx-auto mb-14 max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-purple-300">
          {t("eyebrow")}
        </p>
        <h1 className="font-heading mt-3 text-4xl font-bold text-white md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-white/60">{t("subtitle")}</p>
      </header>

      <div className="grid items-start gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const name = isEs ? plan.name.es : plan.name.en;
          const perks = isEs ? plan.perks.es : plan.perks.en;
          /*
           * ponytail: the "checkout" is an email with the plan already in the
           * subject. Culqi is not affiliated yet, and a button that pretends to
           * charge is worse than one that starts a conversation.
           */
          const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
            t("mail_subject", { plan: name }),
          )}&body=${encodeURIComponent(t("mail_body", { plan: name }))}`;

          return (
            <div key={plan.id} className="relative h-full">
              {plan.featured && (
                <div
                  aria-hidden
                  className="absolute -inset-px rounded-2xl bg-[linear-gradient(140deg,rgba(124,58,237,0.7),rgba(192,132,252,0.35),rgba(124,58,237,0.7))] opacity-70 blur-[2px]"
                />
              )}

              <article
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-6 sm:p-7",
                  plan.featured
                    ? "border-transparent bg-[#0b0b12]/95"
                    : "border-white/[0.08] bg-white/[0.02]",
                )}
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h2 className="font-heading text-lg font-bold text-white">{name}</h2>
                  {plan.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-purple-200">
                      <Sparkles size={11} aria-hidden />
                      {t("popular")}
                    </span>
                  )}
                  {plan.soldOut && (
                    <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white/50">
                      {t("sold_out")}
                    </span>
                  )}
                </div>

                <p className="flex items-baseline gap-1.5">
                  <span className="font-heading text-4xl font-bold text-white">
                    S/ {plan.price}
                  </span>
                  <span className="font-mono text-xs text-white/45">{t("per_month")}</span>
                </p>

                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {isEs ? plan.tagline.es : plan.tagline.en}
                </p>

                {plan.seats !== undefined && !plan.soldOut && (
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-white/40">
                    {t("seats", { seats: plan.seats })}
                  </p>
                )}

                <ul className="mt-6 space-y-3 border-t border-white/[0.07] pt-6">
                  {perks.map((perk) => (
                    <li key={perk} className="flex gap-2.5 text-sm leading-relaxed text-white/70">
                      <Check size={16} className="mt-0.5 shrink-0 text-purple-300" aria-hidden />
                      {perk}
                    </li>
                  ))}
                </ul>

                <a
                  href={mailto}
                  className={cn(
                    "mt-7 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white/70",
                    plan.featured
                      ? "bg-primary text-white hover:bg-violet-500 hover:shadow-[0_0_32px_rgba(124,58,237,0.5)]"
                      : "glass gradient-border text-white/85 hover:text-white",
                  )}
                >
                  {plan.soldOut ? t("cta_waitlist") : t("cta")}
                </a>
              </article>
            </div>
          );
        })}
      </div>

      <p className="mx-auto mt-10 max-w-xl text-center text-xs leading-relaxed text-white/40">
        {t("payments_note")}
      </p>
    </main>
  );
}
