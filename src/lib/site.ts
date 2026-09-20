/**
 * Scheduling link (Cal.com, Calendly, …).
 *
 * NEXT_PUBLIC_* is inlined at build time, so setting this on the host requires
 * a redeploy to take effect — it is not read at runtime.
 *
 * Unset degrades to the contact form rather than shipping a dead link, so the
 * CTA is never missing — only weaker.
 */
export const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL;

/**
 * The highest-intent action the site can offer right now: the scheduling link
 * when one is configured, the contact form otherwise. `fromHome` is false on
 * routes other than `/`, where the anchor needs the leading slash.
 */
export function ctaHref(fromHome = true): string {
  return BOOKING_URL ?? (fromHome ? "#contact" : "/#contact");
}

/** True when `ctaHref` points off-site and needs target/rel. */
export const CTA_IS_EXTERNAL = Boolean(BOOKING_URL);

/** Props for an anchor pointing at the CTA — spread, don't rebuild. */
export const ctaLinkProps = CTA_IS_EXTERNAL
  ? { target: "_blank" as const, rel: "noopener noreferrer" }
  : {};

/**
 * WhatsApp group for the free live workshop — the group doubles as the signup
 * list, so this is the only registration step there is.
 */
export const WORKSHOP_GROUP_URL = "https://chat.whatsapp.com/JXcIkzee7vpLqdypTPF6ln";

/**
 * Direct line for plan signups. There is no gateway on purpose: Yape and Plin
 * are free between people, so a card processor would only take a cut of a
 * S/ 15 membership.
 */
export const WHATSAPP_NUMBER = "51967617166";

/** wa.me link with the first message already written. */
export function whatsappUrl(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
