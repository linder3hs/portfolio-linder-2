"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  CalendarDays,
  CornerDownLeft,
  CreditCard,
  FileText,
  FolderGit2,
  GraduationCap,
  Hash,
  Languages,
  Search,
  type LucideIcon,
} from "lucide-react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import type { IconType } from "react-icons";
import { posts } from "@/lib/posts";
import { projects } from "@/lib/projects";
import { BOOKING_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

type Group = "sections" | "projects" | "writing" | "actions";

interface Item {
  id: string;
  group: Group;
  label: string;
  /** Extra text the query matches against — never rendered. */
  keywords: string;
  icon: LucideIcon | IconType;
  run: () => void;
}

/** Nothing to subscribe to: the only transition is server snapshot → client. */
const subscribeToNothing = () => () => {};

const GROUP_ORDER: Group[] = ["sections", "projects", "writing", "actions"];

const SECTIONS = [
  { id: "services", navKey: "services" },
  { id: "about", navKey: "about" },
  { id: "projects", navKey: "projects" },
  { id: "experience", navKey: "experience" },
];

/** Subsequence match — "aipr" finds "AI PR Review". */
function fuzzyMatch(query: string, haystack: string): boolean {
  let i = 0;
  for (const char of haystack) {
    if (char === query[i]) i += 1;
    if (i === query.length) return true;
  }
  return false;
}

/** Typing into a field shouldn't be hijacked by the shortcut. */
function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el?.tagName) return false;
  return (
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT" ||
    el.isContentEditable
  );
}

export function CommandPalette() {
  const t = useTranslations("command");
  const tNav = useTranslations("nav");
  const locale = useLocale() as "en" | "es";
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // False through hydration, true afterwards — the platform sniff and the
  // portal both need a DOM, and React re-renders once the snapshot flips.
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  const isMac = mounted && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  const close = useCallback(() => setOpen(false), []);

  /** Every entry point resets the query, so the palette always opens clean. */
  const openPalette = useCallback((opener: HTMLElement | null) => {
    openerRef.current = opener;
    setQuery("");
    setActiveIndex(0);
    setOpen(true);
  }, []);

  const go = useCallback(
    (path: string) => {
      close();
      router.push(`/${locale}${path}`);
    },
    [close, locale, router],
  );

  const goSection = useCallback(
    (id: string) => {
      close();
      // Already home: the CSS `scroll-behavior: smooth` + `scroll-padding-top`
      // on <html> handle the animation and the fixed-navbar offset.
      if (pathname === `/${locale}` || pathname === `/${locale}/`) {
        window.location.hash = id;
      } else {
        router.push(`/${locale}#${id}`);
      }
    },
    [close, locale, pathname, router],
  );

  const openExternal = useCallback(
    (url: string) => {
      close();
      window.open(url, "_blank", "noopener,noreferrer");
    },
    [close],
  );

  const switchLocale = useCallback(() => {
    close();
    const next = locale === "en" ? "es" : "en";
    const segments = pathname.split("/");
    segments[1] = next;
    router.replace(segments.join("/"));
  }, [close, locale, pathname, router]);

  const items = useMemo<Item[]>(() => {
    const sectionItems: Item[] = SECTIONS.map(({ id, navKey }) => ({
      id: `section-${id}`,
      group: "sections",
      label: tNav(navKey),
      keywords: `${id} ${navKey}`,
      icon: Hash,
      run: () => goSection(id),
    }));

    const projectItems: Item[] = projects
      .filter((project) => project.featured)
      .map((project) => ({
        id: `project-${project.slug}`,
        group: "projects",
        label: project.title,
        keywords: `${project.slug} ${project.tech.join(" ")}`,
        icon: FolderGit2,
        run: () => go(`/projects/${project.slug}`),
      }));

    projectItems.push({
      id: "project-all",
      group: "projects",
      label: tNav("all_projects"),
      keywords: "projects proyectos todos all",
      icon: FolderGit2,
      run: () => go("/projects"),
    });

    const writingItems: Item[] = posts.map((post) => ({
      id: `post-${post.slug}`,
      group: "writing",
      label: post.title[locale],
      keywords: `${post.slug} ${post.tags.join(" ")}`,
      icon: FileText,
      run: () => go(`/writing/${post.slug}`),
    }));

    writingItems.push({
      id: "writing-all",
      group: "writing",
      label: tNav("writing"),
      keywords: "writing blog escritos articulos posts",
      icon: FileText,
      run: () => go("/writing"),
    });

    const actionItems: Item[] = [
      {
        id: "action-courses",
        group: "actions",
        label: t("actions.courses"),
        keywords: "courses cursos curso clases fundamentos ia avanzada temario",
        icon: GraduationCap,
        run: () => go("/courses"),
      },
      {
        id: "action-workshops",
        group: "actions",
        label: t("actions.workshops"),
        keywords: "workshops calendario calendar eventos events talleres",
        icon: CalendarDays,
        run: () => go("/workshops"),
      },
      {
        id: "action-plans",
        group: "actions",
        label: t("actions.plans"),
        keywords: "plans planes membresia membership suscripcion precios pricing",
        icon: CreditCard,
        run: () => go("/plans"),
      },
      {
        id: "action-call",
        group: "actions",
        label: t("actions.book_call"),
        keywords: "call llamada calendly agendar contact contacto",
        icon: Calendar,
        run: () => (BOOKING_URL ? openExternal(BOOKING_URL) : goSection("contact")),
      },
      {
        id: "action-github",
        group: "actions",
        label: "GitHub",
        keywords: "github code repo linder3hs",
        icon: FiGithub,
        run: () => openExternal("https://github.com/linder3hs"),
      },
      {
        id: "action-linkedin",
        group: "actions",
        label: "LinkedIn",
        keywords: "linkedin social perfil profile",
        icon: FiLinkedin,
        run: () => openExternal("https://linkedin.com/in/linderhassinger"),
      },
      {
        id: "action-locale",
        group: "actions",
        label: t(locale === "en" ? "actions.switch_to_es" : "actions.switch_to_en"),
        keywords: "language idioma locale english ingles inglés espanol español es en",
        icon: Languages,
        run: switchLocale,
      },
    ];

    return [...sectionItems, ...projectItems, ...writingItems, ...actionItems];
  }, [go, goSection, locale, openExternal, switchLocale, t, tNav]);

  /*
   * Literal matches win outright, and the looser subsequence pass only runs
   * when nothing contains the query — otherwise "ingl" scatters across
   * "eLearning Platform" and buries the one item that literally says "inglés".
   * Grouped results can't be reordered by score, so the filter has to be the
   * thing that's picky.
   */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    const haystack = (item: Item) => `${item.label} ${item.keywords}`.toLowerCase();
    const literal = items.filter((item) => haystack(item).includes(q));
    return literal.length > 0 ? literal : items.filter((item) => fuzzyMatch(q, haystack(item)));
  }, [items, query]);

  // Global shortcut. Registered once, regardless of open state, so ⌘K also
  // closes the palette from anywhere that isn't a text field.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return;
      if (!open && isTypingTarget(event.target)) return;
      event.preventDefault();
      if (open) close();
      else openPalette(document.activeElement as HTMLElement | null);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, open, openPalette]);

  // Body scroll lock + focus restore, both tied to the open lifetime.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const opener = openerRef.current;

    return () => {
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, [open]);

  // Keep the highlighted row on screen while arrowing through a long list.
  useEffect(() => {
    if (!open) return;
    const active = listRef.current?.querySelector('[data-active="true"]');
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const onDialogKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (results.length === 0) return;
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((index) => (index + delta + results.length) % results.length);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      results[activeIndex]?.run();
      return;
    }
    // ponytail: the input is the only focusable element inside the dialog
    // (rows are role="option", not buttons), so trapping focus is one line.
    if (event.key === "Tab") {
      event.preventDefault();
      inputRef.current?.focus();
    }
  };

  const shortcutLabel = isMac ? "⌘K" : "Ctrl K";
  let renderedIndex = -1;

  const overlay = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.15 }}
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={close}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("title")}
            onKeyDown={onDialogKeyDown}
            initial={reduceMotion ? undefined : { opacity: 0, scale: 0.97, y: -8 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[640px] overflow-hidden rounded-2xl border border-white/[0.12] bg-background/95 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-4">
              <Search size={16} className="shrink-0 text-white/40" aria-hidden />
              <input
                ref={inputRef}
                autoFocus
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls="command-results"
                aria-autocomplete="list"
                aria-activedescendant={results[activeIndex]?.id}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                placeholder={t("placeholder")}
                aria-label={t("placeholder")}
                /*
                 * Inline, because the global `:focus-visible` outline in
                 * globals.css is unlayered and so beats any Tailwind utility
                 * regardless of specificity. The caret and the highlighted row
                 * are the focus indicator inside the dialog.
                 */
                style={{ outline: "none" }}
                className="w-full bg-transparent py-4 text-sm text-white placeholder:text-white/35"
              />
              <kbd className="hidden shrink-0 rounded border border-white/15 px-1.5 py-0.5 font-mono text-[10px] text-white/45 sm:block">
                esc
              </kbd>
            </div>

            <div
              ref={listRef}
              id="command-results"
              role="listbox"
              aria-label={t("title")}
              className="max-h-[min(60vh,420px)] overflow-y-auto p-2"
            >
              {results.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-white/45">{t("empty")}</p>
              ) : (
                GROUP_ORDER.map((group) => {
                  const groupItems = results.filter((item) => item.group === group);
                  if (groupItems.length === 0) return null;

                  return (
                    <div key={group} className="mb-1">
                      <div className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-widest text-white/35">
                        {t(`groups.${group}`)}
                      </div>
                      {groupItems.map((item) => {
                        renderedIndex += 1;
                        const index = renderedIndex;
                        const isActive = index === activeIndex;
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.id}
                            id={item.id}
                            role="option"
                            aria-selected={isActive}
                            data-active={isActive}
                            onMouseMove={() => setActiveIndex(index)}
                            onClick={() => item.run()}
                            className={cn(
                              "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                              isActive ? "bg-primary/20 text-white" : "text-white/70",
                            )}
                          >
                            <Icon
                              size={15}
                              className={isActive ? "text-accent" : "text-white/40"}
                              aria-hidden
                            />
                            <span className="truncate">{item.label}</span>
                            {isActive && (
                              <CornerDownLeft
                                size={13}
                                className="ml-auto shrink-0 text-white/40"
                                aria-hidden
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={(event) => openPalette(event.currentTarget)}
        aria-label={t("open")}
        aria-keyshortcuts="Meta+K Control+K"
        className="flex items-center gap-2 rounded-full border border-white/15 px-2.5 py-1.5 text-white/60 outline-none transition-colors duration-300 hover:border-purple-400/50 hover:text-white focus-visible:ring-2 focus-visible:ring-purple-400"
      >
        <Search size={14} aria-hidden />
        <kbd className="hidden font-mono text-[10px] font-semibold tracking-widest sm:block" aria-hidden>
          {shortcutLabel}
        </kbd>
      </button>

      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
