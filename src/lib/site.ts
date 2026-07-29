/**
 * Scheduling link (Cal.com, Calendly, …).
 *
 * NEXT_PUBLIC_* is inlined at build time, so setting this on the host requires
 * a redeploy to take effect — it is not read at runtime.
 *
 * Every booking CTA is conditional on this being set, so an unset value
 * degrades to the contact form rather than shipping a dead link.
 */
export const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL;
