export type ProjectCategory =
  | "fullstack"
  | "frontend"
  | "backend"
  | "devtools"
  | "ai";

/** Bilingual string. Keeps case-study copy colocated with the project. */
export interface Localized {
  en: string;
  es: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  descriptionEs: string;
  category: ProjectCategory;
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  /** Shown in the homepage carousel. Keep this to 3-4 projects. */
  featured: boolean;
  year: number;
  /**
   * Screenshot of the live site, under /public/projects/<slug>.jpg.
   * When absent the generated <ProjectPoster> is used instead — so a new
   * project can ship before anyone captures its screenshot.
   */
  image?: string;
  /** Case-study copy for /projects/<slug>. */
  problem?: Localized;
  solution?: Localized;
  highlights?: Localized[];
}

export const projects: Project[] = [
  {
    id: "1",
    slug: "ai-linkedin",
    image: "/projects/ai-linkedin.jpg",
    title: "AI LinkedIn Optimizer",
    description: "AI-powered tool to optimize your LinkedIn profile for maximum visibility and recruiter appeal.",
    descriptionEs: "Herramienta con IA para optimizar tu perfil de LinkedIn y maximizar visibilidad ante reclutadores.",
    category: "ai",
    tech: ["Next.js", "TypeScript", "Claude API", "Claude Code", "Tailwind CSS"],
    liveUrl: "https://ai-linkedin.linderhassinger.dev",
    featured: true,
    year: 2025,
    problem: {
      en: "Most LinkedIn profiles read like a job description instead of a pitch. People know their profile underperforms but have no concrete signal on what to change.",
      es: "La mayoría de perfiles de LinkedIn se leen como una descripción de puesto en vez de un pitch. La gente sabe que su perfil rinde poco, pero no tiene señales concretas de qué cambiar.",
    },
    solution: {
      en: "A guided analyzer that takes a profile section by section and returns rewrites with the reasoning behind each one, so the user learns the pattern instead of just copy-pasting output.",
      es: "Un analizador guiado que toma el perfil sección por sección y devuelve reescrituras con el razonamiento detrás de cada una, para que el usuario aprenda el patrón en vez de solo copiar y pegar.",
    },
    highlights: [
      { en: "Section-by-section analysis with a rewritten version and the reasoning behind it", es: "Análisis sección por sección con versión reescrita y el razonamiento detrás" },
      { en: "Streaming responses so long rewrites appear progressively instead of after a long wait", es: "Respuestas en streaming para que las reescrituras largas aparezcan progresivamente en vez de tras una espera larga" },
      { en: "Prompt design tuned to keep the user's own voice rather than flattening everything into corporate tone", es: "Diseño de prompts afinado para conservar la voz del usuario en vez de aplanar todo a tono corporativo" },
    ],
  },
  {
    id: "2",
    slug: "ai-pr-review",
    image: "/projects/ai-pr-review.jpg",
    title: "AI PR Review",
    description: "Automated code review tool powered by AI that analyzes pull requests and suggests improvements.",
    descriptionEs: "Herramienta de revisión de código automatizada con IA que analiza pull requests y sugiere mejoras.",
    category: "ai",
    tech: ["Next.js", "TypeScript", "Claude API", "Claude Code", "GitHub API"],
    liveUrl: "https://ai-pr-review.linderhassinger.dev",
    featured: true,
    year: 2025,
    problem: {
      en: "Code review is the slowest step in most teams. The mechanical part — naming, missing edge cases, forgotten error handling — eats the reviewer's attention before they reach the parts that actually need human judgement.",
      es: "El code review es el paso más lento en la mayoría de equipos. La parte mecánica — nombres, casos borde faltantes, manejo de errores olvidado — consume la atención del revisor antes de llegar a lo que realmente necesita criterio humano.",
    },
    solution: {
      en: "A reviewer that pulls the diff from the GitHub API, analyzes it with full file context rather than isolated hunks, and reports findings anchored to specific lines.",
      es: "Un revisor que trae el diff desde la GitHub API, lo analiza con contexto completo de archivo en vez de hunks aislados, y reporta hallazgos anclados a líneas específicas.",
    },
    highlights: [
      { en: "Reads the full file around each hunk, so findings account for context the diff alone hides", es: "Lee el archivo completo alrededor de cada hunk, para que los hallazgos consideren contexto que el diff por sí solo oculta" },
      { en: "Findings anchored to file and line so they map directly onto the review UI", es: "Hallazgos anclados a archivo y línea para que mapeen directo sobre la UI de review" },
      { en: "Severity ranking so the noise floor stays low and real issues surface first", es: "Ranking por severidad para mantener bajo el piso de ruido y que los problemas reales aparezcan primero" },
    ],
  },
  {
    id: "6",
    slug: "elearning",
    image: "/projects/elearning.jpg",
    title: "eLearning Platform",
    description: "Full-featured LMS with video courses, progress tracking, certificates, and admin dashboard.",
    descriptionEs: "LMS completo con cursos en video, seguimiento de progreso, certificados y panel de administración.",
    category: "fullstack",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS", "Claude Code"],
    liveUrl: "https://elearning.linderhassinger.dev",
    featured: true,
    year: 2025,
    problem: {
      en: "Off-the-shelf LMS products are either too rigid to fit a specific curriculum or so generic that instructors end up managing content in spreadsheets on the side.",
      es: "Los LMS comerciales son o demasiado rígidos para un currículo específico, o tan genéricos que los instructores terminan gestionando contenido en hojas de cálculo aparte.",
    },
    solution: {
      en: "A full LMS built around the course-module-lesson model, with enrollment, resumable video progress, certificate issuance, and an admin surface for instructors.",
      es: "Un LMS completo construido sobre el modelo curso-módulo-lección, con inscripción, progreso de video reanudable, emisión de certificados y una superficie de administración para instructores.",
    },
    highlights: [
      { en: "Relational schema modelled in Prisma: courses, modules, lessons, enrollments, and per-lesson progress", es: "Esquema relacional modelado en Prisma: cursos, módulos, lecciones, inscripciones y progreso por lección" },
      { en: "Resumable video progress persisted per user so a lesson picks up where it was left", es: "Progreso de video reanudable persistido por usuario para que la lección continúe donde se dejó" },
      { en: "Separate admin surface for course authoring, kept out of the student bundle", es: "Superficie de administración separada para autoría de cursos, fuera del bundle del estudiante" },
    ],
  },
  {
    id: "4",
    slug: "devconf",
    image: "/projects/devconf.jpg",
    title: "DevConf",
    description: "Developer conference platform with schedule management, speaker profiles, and session booking.",
    descriptionEs: "Plataforma de conferencias para desarrolladores con gestión de horarios, perfiles de ponentes y reserva de sesiones.",
    category: "fullstack",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Claude Code"],
    liveUrl: "https://devconf.linderhassinger.dev",
    featured: true,
    year: 2024,
    problem: {
      en: "Conference sites usually ship as a static schedule PDF and a signup form bolted on. Attendees can't tell what they're booked into, and organizers can't see capacity until the day of.",
      es: "Los sitios de conferencias suelen salir como un PDF estático de horarios con un formulario de registro pegado encima. Los asistentes no saben en qué están inscritos y los organizadores no ven aforo hasta el día del evento.",
    },
    solution: {
      en: "A scheduling platform where sessions, speakers, and bookings share one data model, so capacity and conflicts are computed rather than tracked by hand.",
      es: "Una plataforma de agenda donde sesiones, ponentes y reservas comparten un mismo modelo de datos, para que aforo y conflictos se calculen en vez de rastrearse a mano.",
    },
    highlights: [
      { en: "Multi-track schedule grid that detects time conflicts across an attendee's bookings", es: "Grilla de agenda multi-track que detecta conflictos de horario entre las reservas de un asistente" },
      { en: "Session capacity enforced at the database level, not just in the UI", es: "Aforo de sesión aplicado a nivel de base de datos, no solo en la UI" },
      { en: "Speaker profiles linked to their sessions, generated as static pages for SEO", es: "Perfiles de ponentes enlazados a sus sesiones, generados como páginas estáticas para SEO" },
    ],
  },
  {
    id: "3",
    slug: "compare-macs",
    image: "/projects/compare-macs.jpg",
    title: "Mac Comparator",
    description: "Interactive side-by-side comparison tool for Apple Mac models with detailed spec sheets.",
    descriptionEs: "Herramienta interactiva de comparación lado a lado de modelos Mac de Apple con fichas técnicas detalladas.",
    category: "frontend",
    tech: ["React", "TypeScript", "Tailwind CSS", "Claude Code"],
    liveUrl: "https://compare-macs.linderhassinger.dev",
    featured: false,
    year: 2024,
    problem: {
      en: "Apple's own comparison pages only let you line up a handful of current models, and third-party spec tables are dense walls of text where the differences are hard to spot.",
      es: "Las páginas de comparación de Apple solo permiten alinear un puñado de modelos actuales, y las tablas de terceros son muros de texto densos donde las diferencias son difíciles de ver.",
    },
    solution: {
      en: "A side-by-side comparator that highlights only the rows where the selected models actually differ, so the decision-relevant information surfaces immediately.",
      es: "Un comparador lado a lado que resalta solo las filas donde los modelos elegidos realmente difieren, para que la información relevante a la decisión aparezca de inmediato.",
    },
  },
  {
    id: "5",
    slug: "duolingo",
    image: "/projects/duolingo.jpg",
    title: "Duolingo Clone",
    description: "Gamified language learning application with lessons, streaks, and progress tracking.",
    descriptionEs: "Aplicación de aprendizaje de idiomas gamificada con lecciones, rachas y seguimiento de progreso.",
    category: "frontend",
    tech: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Claude Code"],
    liveUrl: "https://duolingo.linderhassinger.dev",
    featured: false,
    year: 2024,
    problem: {
      en: "Gamified learning UIs look simple but hide real state complexity: streaks, hearts, lesson unlocking, and progress all mutate together and have to stay consistent across sessions.",
      es: "Las UIs de aprendizaje gamificado parecen simples pero esconden complejidad de estado real: rachas, vidas, desbloqueo de lecciones y progreso mutan juntos y deben mantenerse consistentes entre sesiones.",
    },
    solution: {
      en: "A rebuild of the core lesson loop with the reward mechanics modelled explicitly, plus the motion work that makes the feedback feel immediate.",
      es: "Una reconstrucción del bucle central de lecciones con las mecánicas de recompensa modeladas explícitamente, más el trabajo de animación que hace que el feedback se sienta inmediato.",
    },
  },
  {
    id: "7",
    slug: "financial",
    image: "/projects/financial.jpg",
    title: "Financial Dashboard",
    description: "Personal finance dashboard with expense tracking, budget planning, and visual analytics.",
    descriptionEs: "Panel de finanzas personales con seguimiento de gastos, planificación de presupuesto y análisis visual.",
    category: "frontend",
    tech: ["React", "TypeScript", "Recharts", "Tailwind CSS", "Claude Code"],
    liveUrl: "https://financial.linderhassinger.dev",
    featured: false,
    year: 2024,
    problem: {
      en: "Budgeting apps show you what you spent but rarely make the trend legible — the number that matters is the direction, not the balance.",
      es: "Las apps de presupuesto muestran lo que gastaste pero rara vez hacen legible la tendencia — el número que importa es la dirección, no el saldo.",
    },
    solution: {
      en: "A dashboard built around period-over-period comparison, with category breakdowns and budget burn-down rather than a raw transaction list.",
      es: "Un panel construido alrededor de la comparación período a período, con desglose por categoría y consumo de presupuesto en vez de una lista cruda de transacciones.",
    },
  },
  {
    id: "8",
    slug: "js",
    image: "/projects/js.jpg",
    title: "JS Playground",
    description: "Interactive JavaScript playground with live code execution, console output, and shareable snippets.",
    descriptionEs: "Playground interactivo de JavaScript con ejecución de código en vivo, salida de consola y fragmentos compartibles.",
    category: "devtools",
    tech: ["React", "TypeScript", "Monaco Editor", "Claude Code"],
    liveUrl: "https://js.linderhassinger.dev",
    featured: false,
    year: 2024,
    problem: {
      en: "Trying out a snippet usually means opening devtools and losing it, or spinning up a whole sandbox project for four lines of code.",
      es: "Probar un snippet normalmente significa abrir devtools y perderlo, o levantar un proyecto sandbox completo para cuatro líneas de código.",
    },
    solution: {
      en: "A browser playground with Monaco, sandboxed execution, a captured console, and URL-encoded snippets so a result can be shared as a link.",
      es: "Un playground en el navegador con Monaco, ejecución aislada, consola capturada y snippets codificados en la URL para poder compartir un resultado como enlace.",
    },
  },
  {
    id: "9",
    slug: "playground",
    image: "/projects/playground.jpg",
    title: "Dev Playground",
    description: "Multi-language development sandbox for experimenting with code and sharing experiments.",
    descriptionEs: "Sandbox de desarrollo multi-lenguaje para experimentar con código y compartir experimentos.",
    category: "devtools",
    tech: ["Next.js", "TypeScript", "Docker", "Monaco Editor", "Claude Code"],
    liveUrl: "https://playground.linderhassinger.dev",
    featured: false,
    year: 2024,
    problem: {
      en: "A single-language playground stops being useful the moment the experiment needs a runtime the browser doesn't have.",
      es: "Un playground de un solo lenguaje deja de ser útil en el momento en que el experimento necesita un runtime que el navegador no tiene.",
    },
    solution: {
      en: "A sandbox that runs each language in its own container, keeping execution isolated from the host while sharing one editor surface.",
      es: "Un sandbox que ejecuta cada lenguaje en su propio contenedor, manteniendo la ejecución aislada del host mientras comparte una sola superficie de editor.",
    },
  },
  {
    id: "10",
    slug: "readme",
    image: "/projects/readme.jpg",
    title: "README Generator",
    description: "AI-powered README generator that creates professional documentation for GitHub repositories.",
    descriptionEs: "Generador de README con IA que crea documentación profesional para repositorios de GitHub.",
    category: "ai",
    tech: ["Next.js", "TypeScript", "Claude API", "Claude Code"],
    liveUrl: "https://readme.linderhassinger.dev",
    featured: false,
    year: 2025,
    problem: {
      en: "The README is the first thing anyone reads and the last thing anyone writes. Most repos ship with the framework's default scaffold still in place.",
      es: "El README es lo primero que todos leen y lo último que alguien escribe. La mayoría de repos salen con el scaffold por defecto del framework todavía puesto.",
    },
    solution: {
      en: "A generator that reads the repository's actual structure and dependencies to produce a README grounded in what the project really is, not a generic template.",
      es: "Un generador que lee la estructura y dependencias reales del repositorio para producir un README basado en lo que el proyecto realmente es, no una plantilla genérica.",
    },
  },
  {
    id: "13",
    slug: "vision-board",
    image: "/projects/vision-board.jpg",
    title: "Vision Board",
    description: "Digital vision board for visualizing goals with drag-and-drop image collages and mood boards.",
    descriptionEs: "Tablero de visión digital para visualizar metas con collages de imágenes arrastrables y tableros de estado de ánimo.",
    category: "frontend",
    tech: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Claude Code"],
    liveUrl: "https://vision-board.linderhassinger.dev",
    featured: false,
    year: 2024,
    problem: {
      en: "Mood boards live in Pinterest or a folder of screenshots, where they stop being a single composed thing you can look at.",
      es: "Los mood boards viven en Pinterest o en una carpeta de capturas, donde dejan de ser una sola cosa compuesta que puedas mirar.",
    },
    solution: {
      en: "A free-form canvas with drag, resize, and layering, persisted locally so the board survives a reload without an account.",
      es: "Un lienzo libre con arrastre, redimensionado y capas, persistido localmente para que el tablero sobreviva una recarga sin necesidad de cuenta.",
    },
  },
  {
    id: "11",
    slug: "todoapp",
    image: "/projects/todoapp.jpg",
    title: "Todo App",
    description: "Minimalist task management app with drag-and-drop, priorities, and local persistence.",
    descriptionEs: "Aplicación minimalista de gestión de tareas con arrastrar y soltar, prioridades y persistencia local.",
    category: "frontend",
    tech: ["React", "TypeScript", "Tailwind CSS", "Claude Code"],
    liveUrl: "https://todoapp.linderhassinger.dev",
    featured: false,
    year: 2023,
  },
  {
    id: "12",
    slug: "trivia",
    image: "/projects/trivia.jpg",
    title: "Trivia App",
    description: "Interactive trivia game with multiple categories, difficulty levels, and real-time leaderboard.",
    descriptionEs: "Juego de trivia interactivo con múltiples categorías, niveles de dificultad y tabla de clasificación en tiempo real.",
    category: "frontend",
    tech: ["React", "TypeScript", "Open Trivia DB API", "Claude Code"],
    liveUrl: "https://trivia.linderhassinger.dev",
    featured: false,
    year: 2023,
  },
];

/** Homepage carousel. Deliberately small — each entry costs a full viewport of scroll. */
export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Categories actually present in the data, in a stable display order. */
const CATEGORY_ORDER: ProjectCategory[] = [
  "ai",
  "fullstack",
  "frontend",
  "devtools",
  "backend",
];

export const usedCategories: ProjectCategory[] = CATEGORY_ORDER.filter((c) =>
  projects.some((p) => p.category === c),
);

export function localized(value: Localized | undefined, locale: string) {
  if (!value) return undefined;
  return locale === "es" ? value.es : value.en;
}

export function projectDescription(project: Project, locale: string) {
  return locale === "es" ? project.descriptionEs : project.description;
}
