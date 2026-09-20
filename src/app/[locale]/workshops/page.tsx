import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { ArrowRight, Clock, Radio } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { MiniCalendar } from "@/components/workshops/MiniCalendar";
import { routing } from "@/i18n/routing";
import { addMinutes, formatDate } from "@/lib/calendar";
import { WORKSHOP_GROUP_URL } from "@/lib/site";
import { workshopMonths, workshops } from "@/lib/workshops";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "workshops" });

  return {
    title: `${t("title")} | Linder Hassinger`,
    description: t("subtitle"),
    alternates: {
      canonical: `/${locale}/workshops`,
      languages: {
        en: "/en/workshops",
        es: "/es/workshops",
        "x-default": "/en/workshops",
      },
    },
  };
}

export default async function WorkshopsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "workshops" });
  const isEs = locale === "es";
  const tag = isEs ? "es-PE" : "en-US";
  const weekdays = t.raw("weekdays") as string[];

  const months = workshopMonths();

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <header className="mb-14 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-purple-300">
          {t("eyebrow")}
        </p>
        <h1 className="font-heading mt-3 text-4xl font-bold text-white md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-white/60">{t("subtitle")}</p>
      </header>

      {/*
        Calendar left, agenda right — the calendar is the index, the cards are
        the content. One column below md, where a 280px sidebar would squeeze
        both.
      */}
      <div className="grid gap-10 md:grid-cols-[280px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <div className="space-y-4">
            {months.map(({ key, year, month }) => (
              <MiniCalendar
                key={key}
                year={year}
                month={month}
                locale={tag}
                weekdays={weekdays}
                eventDays={workshops
                  .filter((workshop) => workshop.date.startsWith(key))
                  .map((workshop) => Number(workshop.date.slice(8)))}
              />
            ))}

            {/*
              The QR moved here from the hero: this is the page where someone
              is actually deciding to attend. Desktop only — on a phone the
              button below is one tap and a QR is dead weight.
            */}
            <div className="glass hidden flex-col items-center gap-3 rounded-2xl border border-white/[0.08] p-5 text-center sm:flex">
              <div className="rounded-xl bg-white p-2 shadow-[0_0_36px_rgba(37,211,102,0.28)]">
                <Image
                  src="/workshop-qr.png"
                  alt={t("qr_alt")}
                  width={128}
                  height={128}
                  className="h-32 w-32 rounded-md"
                />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                {t("qr_hint")}
              </p>
            </div>

            <a
              href={WORKSHOP_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-[#06251a] outline-none transition-all duration-300 hover:bg-[#1fbe5a] hover:shadow-[0_0_32px_rgba(37,211,102,0.45)] focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <SiWhatsapp size={16} />
              {t("join")}
            </a>

            <p className="text-center text-xs leading-relaxed text-white/40">
              {t("group_note")}
            </p>
          </div>
        </aside>

        <section className="space-y-6">
          {workshops.length === 0 && (
            <p className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center text-white/55">
              {t("empty")}
            </p>
          )}

          {workshops.map((workshop, index) => (
            <article
              key={workshop.id}
              className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors duration-300 hover:border-purple-400/30 sm:p-7"
            >
              <div className="flex gap-5">
                <div className="h-fit w-16 shrink-0 rounded-xl border border-purple-400/20 bg-primary/10 py-3 text-center">
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-purple-300">
                    {formatDate(workshop.date, tag, { month: "short" })}
                  </span>
                  <span className="font-heading block text-2xl font-bold leading-tight text-white">
                    {formatDate(workshop.date, tag, { day: "numeric" })}
                  </span>
                  <span className="block font-mono text-[10px] uppercase text-white/40">
                    {formatDate(workshop.date, tag, { weekday: "short" })}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-emerald-300">
                      {t("free")}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white/55">
                      <Radio size={11} aria-hidden />
                      {t("live")}
                    </span>
                    <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white/55">
                      {isEs ? workshop.level.es : workshop.level.en}
                    </span>
                    {index === 0 && (
                      <span className="rounded-full bg-primary/20 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-purple-200">
                        {t("next")}
                      </span>
                    )}
                  </div>

                  <h2 className="font-heading text-xl font-bold leading-snug text-white md:text-2xl">
                    {isEs ? workshop.title.es : workshop.title.en}
                  </h2>

                  <p className="mt-2 leading-relaxed text-white/65">
                    {isEs ? workshop.summary.es : workshop.summary.en}
                  </p>

                  <p className="mt-4 flex flex-wrap items-center gap-2 font-mono text-xs text-white/50">
                    <Clock size={13} aria-hidden />
                    <span>
                      {workshop.time} – {addMinutes(workshop.time, workshop.durationMin)}
                    </span>
                    <span aria-hidden>·</span>
                    <span>{t("timezone")}</span>
                    <span aria-hidden>·</span>
                    <span>{t("duration", { minutes: workshop.durationMin })}</span>
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {workshop.topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-white/60"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <a
                    href={WORKSHOP_GROUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-[#06251a] outline-none transition-all duration-300 hover:bg-[#1fbe5a] hover:shadow-[0_0_32px_rgba(37,211,102,0.45)] focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    <SiWhatsapp size={15} />
                    {t("join")}
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
