export type ProjectCategory =
  | "fullstack"
  | "frontend"
  | "backend"
  | "devtools"
  | "ai";

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
  featured: boolean;
  year: number;
}

export const projects: Project[] = [
  {
    id: "1",
    slug: "ai-linkedin",
    title: "AI LinkedIn Optimizer",
    description: "AI-powered tool to optimize your LinkedIn profile for maximum visibility and recruiter appeal.",
    descriptionEs: "Herramienta con IA para optimizar tu perfil de LinkedIn y maximizar visibilidad ante reclutadores.",
    category: "ai",
    tech: ["Next.js", "TypeScript", "Claude API", "Claude Code", "Tailwind CSS"],
    liveUrl: "https://ai-linkedin.linderhassinger.dev",
    featured: true,
    year: 2025,
  },
  {
    id: "2",
    slug: "ai-pr-review",
    title: "AI PR Review",
    description: "Automated code review tool powered by AI that analyzes pull requests and suggests improvements.",
    descriptionEs: "Herramienta de revisión de código automatizada con IA que analiza pull requests y sugiere mejoras.",
    category: "ai",
    tech: ["Next.js", "TypeScript", "Claude API", "Claude Code", "GitHub API"],
    liveUrl: "https://ai-pr-review.linderhassinger.dev",
    featured: true,
    year: 2025,
  },
  {
    id: "3",
    slug: "compare-macs",
    title: "Mac Comparator",
    description: "Interactive side-by-side comparison tool for Apple Mac models with detailed spec sheets.",
    descriptionEs: "Herramienta interactiva de comparación lado a lado de modelos Mac de Apple con fichas técnicas detalladas.",
    category: "frontend",
    tech: ["React", "TypeScript", "Tailwind CSS", "Claude Code"],
    liveUrl: "https://compare-macs.linderhassinger.dev",
    featured: true,
    year: 2024,
  },
  {
    id: "4",
    slug: "devconf",
    title: "DevConf",
    description: "Developer conference platform with schedule management, speaker profiles, and session booking.",
    descriptionEs: "Plataforma de conferencias para desarrolladores con gestión de horarios, perfiles de ponentes y reserva de sesiones.",
    category: "fullstack",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Claude Code"],
    liveUrl: "https://devconf.linderhassinger.dev",
    featured: true,
    year: 2024,
  },
  {
    id: "5",
    slug: "duolingo",
    title: "Duolingo Clone",
    description: "Gamified language learning application with lessons, streaks, and progress tracking.",
    descriptionEs: "Aplicación de aprendizaje de idiomas gamificada con lecciones, rachas y seguimiento de progreso.",
    category: "frontend",
    tech: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Claude Code"],
    liveUrl: "https://duolingo.linderhassinger.dev",
    featured: true,
    year: 2024,
  },
  {
    id: "6",
    slug: "elearning",
    title: "eLearning Platform",
    description: "Full-featured LMS with video courses, progress tracking, certificates, and admin dashboard.",
    descriptionEs: "LMS completo con cursos en video, seguimiento de progreso, certificados y panel de administración.",
    category: "fullstack",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS", "Claude Code"],
    liveUrl: "https://elearning.linderhassinger.dev",
    featured: true,
    year: 2025,
  },
  {
    id: "7",
    slug: "financial",
    title: "Financial Dashboard",
    description: "Personal finance dashboard with expense tracking, budget planning, and visual analytics.",
    descriptionEs: "Panel de finanzas personales con seguimiento de gastos, planificación de presupuesto y análisis visual.",
    category: "frontend",
    tech: ["React", "TypeScript", "Recharts", "Tailwind CSS", "Claude Code"],
    liveUrl: "https://financial.linderhassinger.dev",
    featured: true,
    year: 2024,
  },
  {
    id: "8",
    slug: "js",
    title: "JS Playground",
    description: "Interactive JavaScript playground with live code execution, console output, and shareable snippets.",
    descriptionEs: "Playground interactivo de JavaScript con ejecución de código en vivo, salida de consola y fragmentos compartibles.",
    category: "devtools",
    tech: ["React", "TypeScript", "Monaco Editor", "Claude Code"],
    liveUrl: "https://js.linderhassinger.dev",
    featured: true,
    year: 2024,
  },
  {
    id: "9",
    slug: "playground",
    title: "Dev Playground",
    description: "Multi-language development sandbox for experimenting with code and sharing experiments.",
    descriptionEs: "Sandbox de desarrollo multi-lenguaje para experimentar con código y compartir experimentos.",
    category: "devtools",
    tech: ["Next.js", "TypeScript", "Docker", "Monaco Editor", "Claude Code"],
    liveUrl: "https://playground.linderhassinger.dev",
    featured: true,
    year: 2024,
  },
  {
    id: "10",
    slug: "readme",
    title: "README Generator",
    description: "AI-powered README generator that creates professional documentation for GitHub repositories.",
    descriptionEs: "Generador de README con IA que crea documentación profesional para repositorios de GitHub.",
    category: "ai",
    tech: ["Next.js", "TypeScript", "Claude API", "Claude Code"],
    liveUrl: "https://readme.linderhassinger.dev",
    featured: true,
    year: 2025,
  },
  {
    id: "11",
    slug: "todoapp",
    title: "Todo App",
    description: "Minimalist task management app with drag-and-drop, priorities, and local persistence.",
    descriptionEs: "Aplicación minimalista de gestión de tareas con arrastrar y soltar, prioridades y persistencia local.",
    category: "frontend",
    tech: ["React", "TypeScript", "Tailwind CSS", "Claude Code"],
    liveUrl: "https://todoapp.linderhassinger.dev",
    featured: true,
    year: 2023,
  },
  {
    id: "12",
    slug: "trivia",
    title: "Trivia App",
    description: "Interactive trivia game with multiple categories, difficulty levels, and real-time leaderboard.",
    descriptionEs: "Juego de trivia interactivo con múltiples categorías, niveles de dificultad y tabla de clasificación en tiempo real.",
    category: "frontend",
    tech: ["React", "TypeScript", "Open Trivia DB API", "Claude Code"],
    liveUrl: "https://trivia.linderhassinger.dev",
    featured: true,
    year: 2023,
  },
  {
    id: "13",
    slug: "vision-board",
    title: "Vision Board",
    description: "Digital vision board for visualizing goals with drag-and-drop image collages and mood boards.",
    descriptionEs: "Tablero de visión digital para visualizar metas con collages de imágenes arrastrables y tableros de estado de ánimo.",
    category: "frontend",
    tech: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Claude Code"],
    liveUrl: "https://vision-board.linderhassinger.dev",
    featured: true,
    year: 2024,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
