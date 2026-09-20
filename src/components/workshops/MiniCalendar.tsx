import { formatDate, monthGrid } from "@/lib/calendar";

/**
 * The small month on the left of the workshop page. A server component with no
 * state: the grid is pure math over year/month, so there is nothing to hydrate
 * and no calendar library to ship.
 */
export function MiniCalendar({
  year,
  month,
  eventDays,
  locale,
  weekdays,
}: {
  year: number;
  month: number;
  /** Days of this month that hold a workshop. */
  eventDays: number[];
  locale: string;
  /** Monday-first initials, from the caller's translations. */
  weekdays: string[];
}) {
  const monthLabel = formatDate(`${year}-${String(month).padStart(2, "0")}-01`, locale, {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="glass rounded-2xl border border-white/[0.08] p-4">
      <p className="font-heading mb-3 text-sm font-semibold text-white first-letter:uppercase">
        {monthLabel}
      </p>

      <div className="grid grid-cols-7 gap-1 text-center">
        {weekdays.map((day, i) => (
          <span
            key={i}
            aria-hidden
            className="pb-1 font-mono text-[10px] uppercase tracking-widest text-white/35"
          >
            {day}
          </span>
        ))}

        {monthGrid(year, month)
          .flat()
          .map((day, i) => {
            if (day === 0) return <span key={i} aria-hidden />;

            const hasEvent = eventDays.includes(day);
            const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            return (
              <time
                key={i}
                dateTime={date}
                className={
                  hasEvent
                    ? "relative flex h-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white shadow-[0_0_18px_rgba(124,58,237,0.5)]"
                    : "flex h-8 items-center justify-center rounded-lg text-xs text-white/45"
                }
              >
                {day}
              </time>
            );
          })}
      </div>
    </div>
  );
}
