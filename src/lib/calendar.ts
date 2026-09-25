/**
 * Month grid for the workshop calendar. Monday-first (Peru), 0 = padding cell.
 *
 * Everything runs in UTC on purpose: the caller passes plain year/month/day
 * numbers read from JSON, so a server in any timezone produces the same grid
 * as the browser — a local-time `new Date()` here would shift the whole month
 * by a day for half the world.
 */
export function monthGrid(year: number, month: number): number[][] {
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  // getUTCDay() is Sunday-first; shift so Monday lands on column 0.
  const cells: number[] = Array((firstWeekday + 6) % 7).fill(0);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(0);

  return Array.from({ length: cells.length / 7 }, (_, row) =>
    cells.slice(row * 7, row * 7 + 7),
  );
}

/** `"18:00"` + 90 → `"19:30"`. Wraps past midnight rather than overflowing. */
export function addMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(":").map(Number);
  const total = (hours * 60 + mins + minutes) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** `"2026-10-27"` + 7 → `"2026-11-03"`. UTC throughout, like the rest. */
export function addDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

/** Formats a `YYYY-MM-DD` string without ever touching the local timezone. */
export function formatDate(
  date: string,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): string {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(locale, {
    ...options,
    timeZone: "UTC",
  });
}
