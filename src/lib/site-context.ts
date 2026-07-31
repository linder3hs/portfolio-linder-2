import { projects } from "./projects";
import en from "@/messages/en.json";

/**
 * The grounding context for the assistant, assembled from the same data the
 * site renders. Nothing here is written by hand twice — when a project or a
 * role changes, the assistant's knowledge changes with it.
 */
export function buildSiteContext(): string {
  const experience = (en.experience.entries as Array<{
    title: string;
    company: string;
    period: string;
    context?: string;
    bullets: string[];
  }>)
    .map(
      (e) =>
        `- ${e.title} at ${e.company} (${e.period})${e.context ? ` — ${e.context}` : ""}\n` +
        e.bullets.map((b) => `  * ${b}`).join("\n"),
    )
    .join("\n");

  const work = projects
    .map((p) => {
      const parts = [
        `- ${p.title} (${p.category}, ${p.year}) — ${p.description}`,
        `  Stack: ${p.tech.join(", ")}`,
      ];
      if (p.liveUrl) parts.push(`  Live: ${p.liveUrl}`);
      if (p.problem) parts.push(`  Problem: ${p.problem.en}`);
      if (p.solution) parts.push(`  Approach: ${p.solution.en}`);
      return parts.join("\n");
    })
    .join("\n");

  const services = (en.services.items as Array<{
    name: string;
    duration: string;
    summary: string;
    bullets: string[];
    outcome: string;
  }>)
    .map(
      (s) =>
        `- ${s.name} (${s.duration}) — ${s.summary}\n` +
        s.bullets.map((b) => `  * ${b}`).join("\n") +
        `\n  ${s.outcome}`,
    )
    .join("\n");

  return `# About Linder Hassinger

${en.about.bio}

Location: ${en.about.location}. Available for: ${en.about.remote}.
Contact: linderhassinger00@gmail.com
GitHub: https://github.com/linder3hs
LinkedIn: https://linkedin.com/in/linderhassinger

# How he works with clients

${services}

${en.services.note}
Pricing is not published — it depends on scope and is settled on the first call.

# Work experience

${experience}

# Projects

${work}

# Availability

${en.contact.availability}. ${en.footer.subtagline}`;
}
