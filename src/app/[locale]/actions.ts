"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactPayload {
  name: string;
  email: string;
  message: string;
  projectType?: string;
  timeline?: string;
}

/** Everything below is interpolated into HTML, and all of it is attacker-controlled. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Trim, cap, and escape in one step — nothing reaches the template raw. */
function clean(value: string | undefined, max: number): string {
  return escapeHtml((value ?? "").trim().slice(0, max));
}

export async function sendContactEmail(
  payload: ContactPayload
): Promise<{ success: boolean; error?: string }> {
  if (!payload.name?.trim() || !payload.email?.trim() || !payload.message?.trim()) {
    return { success: false, error: "All fields are required." };
  }

  const name = clean(payload.name, 100);
  const email = clean(payload.email, 200);
  const message = clean(payload.message, 5000);
  const projectType = clean(payload.projectType, 100);
  const timeline = clean(payload.timeline, 100);

  // Subject carries the qualifier so the inbox is sortable without opening mail.
  const subject = projectType
    ? `[${projectType}] Portfolio contact from ${name}`
    : `Portfolio contact from ${name}`;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_TO_EMAIL!,
      replyTo: payload.email.trim(),
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0A0A0F; color: #F8FAFC; border-radius: 12px;">
          <h2 style="color: #A855F7; margin-bottom: 8px;">New message from your portfolio</h2>
          <hr style="border-color: rgba(255,255,255,0.08); margin-bottom: 24px;" />

          <p style="margin: 0 0 4px; color: rgba(255,255,255,0.5); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">From</p>
          <p style="margin: 0 0 20px; font-size: 16px; font-weight: 600;">${name}</p>

          <p style="margin: 0 0 4px; color: rgba(255,255,255,0.5); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Email</p>
          <p style="margin: 0 0 20px;"><a href="mailto:${email}" style="color: #A855F7;">${email}</a></p>

          ${
            projectType || timeline
              ? `<p style="margin: 0 0 4px; color: rgba(255,255,255,0.5); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Looking for</p>
          <p style="margin: 0 0 20px; font-size: 15px;">${projectType}${timeline ? ` <span style="color: rgba(255,255,255,0.5);">·</span> ${timeline}` : ""}</p>`
              : ""
          }

          <p style="margin: 0 0 4px; color: rgba(255,255,255,0.5); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Message</p>
          <p style="margin: 0; line-height: 1.6; color: rgba(255,255,255,0.8); white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    return { success: true };
  } catch (err) {
    console.error("[Resend error]", err);
    return { success: false, error: "Failed to send. Please try again." };
  }
}
