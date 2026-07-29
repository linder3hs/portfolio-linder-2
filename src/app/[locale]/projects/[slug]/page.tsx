import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  getProject,
  localized,
  projectDescription,
  projects,
} from "@/lib/projects";
import { metaFor, techIconMap } from "@/lib/project-meta";
import { ProjectPoster } from "@/components/projects/ProjectPoster";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: `${project.title} | Linder Hassinger`,
    description: projectDescription(project, locale),
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: {
        en: `/en/projects/${slug}`,
        es: `/es/projects/${slug}`,
        "x-default": `/en/projects/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      title: project.title,
      description: projectDescription(project, locale),
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getProject(slug);
  if (!project) notFound();

  const t = await getTranslations({ locale, namespace: "projects" });
  const meta = metaFor(project.category);

  const problem = localized(project.problem, locale);
  const solution = localized(project.solution, locale);
  const highlights = project.highlights
    ?.map((h) => localized(h, locale))
    .filter((h): h is string => Boolean(h));

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <main className="mx-auto max-w-4xl px-6 pb-24 pt-32">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 rounded text-sm text-white/60 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <ArrowLeft size={14} />
        {t("back_to_all")}
      </Link>

      <header className="mt-8">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{
              color: meta.color,
              background: `${meta.color}1A`,
              border: `1px solid ${meta.color}40`,
            }}
          >
            {meta.glyph} {project.category}
          </span>
          <span className="font-mono text-xs text-white/50">{project.year}</span>
        </div>

        <h1 className="font-heading mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">
          {project.title}
        </h1>

        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/65">
          {projectDescription(project, locale)}
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white/60"
              style={{
                color: meta.color,
                background: `${meta.color}1A`,
                border: `1px solid ${meta.color}4D`,
              }}
            >
              <ArrowUpRight size={15} />
              {t("live")}
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white/70 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <FiGithub size={15} />
              {t("code")}
            </a>
          )}
        </div>
      </header>

      <ProjectPoster
        project={project}
        priority
        className="mt-12 aspect-[16/10] w-full rounded-2xl border border-white/10"
      />

      {(problem || solution) && (
        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {problem && (
            <section>
              <h2 className="font-heading text-sm font-bold uppercase tracking-[0.16em] text-white/50">
                {t("problem")}
              </h2>
              <p className="mt-3 leading-relaxed text-white/70">{problem}</p>
            </section>
          )}
          {solution && (
            <section>
              <h2 className="font-heading text-sm font-bold uppercase tracking-[0.16em] text-white/50">
                {t("solution")}
              </h2>
              <p className="mt-3 leading-relaxed text-white/70">{solution}</p>
            </section>
          )}
        </div>
      )}

      {highlights && highlights.length > 0 && (
        <section className="mt-14">
          <h2 className="font-heading text-sm font-bold uppercase tracking-[0.16em] text-white/50">
            {t("highlights")}
          </h2>
          <ul className="mt-4 space-y-3">
            {highlights.map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed text-white/70">
                <span aria-hidden style={{ color: meta.color }}>
                  {meta.glyph}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-14">
        <h2 className="font-heading text-sm font-bold uppercase tracking-[0.16em] text-white/50">
          {t("stack")}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((tech) => {
            const icon = techIconMap[tech];
            return (
              <span
                key={tech}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70"
              >
                {icon && <icon.Icon size={12} style={{ color: icon.color }} />}
                {tech}
              </span>
            );
          })}
        </div>
      </section>

      <nav className="mt-20 border-t border-white/10 pt-8">
        <Link
          href={`/projects/${next.slug}`}
          className="group flex items-center justify-between gap-4 rounded outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-white/50">
            {t("next_project")}
          </span>
          <span className="font-heading flex items-center gap-2 text-lg font-bold text-white/80 transition-colors group-hover:text-white">
            {next.title}
            <ArrowUpRight size={16} />
          </span>
        </Link>
      </nav>
    </main>
  );
}
