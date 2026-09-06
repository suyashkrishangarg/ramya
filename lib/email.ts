/**
 * welcome email — plain fetch against resend's rest api (no sdk dependency).
 *
 * getting started without a company email:
 *   1. sign up at resend.com (free tier: 100 emails/day, 3,000/month)
 *   2. create an api key and set RESEND_API_KEY in .env.local / vercel env vars
 *   3. until you verify your own domain, resend delivers only to the email
 *      address you registered with (sender: onboarding@resend.dev) — enough to
 *      test end-to-end.
 *   4. once you have a domain: verify it under resend → domains, then set
 *      EMAIL_FROM="ramya ai <hello@yourdomain.com>" and every signup gets the
 *      welcome email for real.
 *
 * if RESEND_API_KEY is unset the send is skipped and only logged — the
 * waitlist keeps working with zero configuration.
 */

const RESEND_API = "https://api.resend.com/emails";

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

type WelcomeInput = {
  email: string;
  name?: string | null;
  position?: number | null;
};

export async function sendWaitlistWelcome({
  email,
  name,
  position,
}: WelcomeInput): Promise<boolean> {
  if (!emailConfigured()) {
    console.log(`[email] RESEND_API_KEY not set — skipped welcome email to ${email}`);
    return false;
  }

  const first = (name ?? "").trim().split(/\s+/)[0] || "";
  const greeting = first ? `hi ${first},` : "hi there,";
  const positionHtml = position
    ? `<p style="margin:24px 0;">
         <span style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;color:#a3a3a0;letter-spacing:.12em;">your position</span><br/>
         <span style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:34px;font-weight:700;color:#fafafa;letter-spacing:-0.02em;">#${String(position).padStart(5, "0")}</span>
       </p>`
    : "";

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#060606;">
    <div style="max-width:520px;margin:0 auto;padding:48px 32px;background:#060606;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;">
      <p style="margin:0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;letter-spacing:.2em;color:#6b6b68;">ramya ai · waitlist</p>
      <h1 style="margin:20px 0 0;font-size:32px;font-weight:700;letter-spacing:-0.03em;line-height:1.1;color:#fafafa;">thanks for showing<br/>interest in ramya.</h1>
      <p style="margin:20px 0 0;font-size:15px;line-height:1.65;color:#c9c9c7;">
        ${greeting} you&apos;re officially on the waitlist for <strong style="color:#fafafa;">aura desktop</strong> — the universal hybrid agent platform. routine tasks run free on your hardware, deep reasoning escalates to optimized cloud models.
      </p>
      ${positionHtml}
      <p style="margin:0 0 8px;font-size:15px;line-height:1.65;color:#c9c9c7;">
        your spot is locked, and one signup covers <strong style="color:#fafafa;">ramya flow</strong> early access too. we&apos;ll email you the moment your beta invite is ready — no spam, ever.
      </p>
      <p style="margin:28px 0 0;font-size:13px;line-height:1.6;color:#6b6b68;">
        — team ramya · ramyaai.tech<br/>local first · cloud when it counts
      </p>
    </div>
  </body>
</html>`;

  const text = [
    greeting,
    "",
    "thanks for showing interest in ramya. you're officially on the waitlist for aura desktop — the universal hybrid agent platform.",
    position ? `\nyour position: #${String(position).padStart(5, "0")}` : "",
    "",
    "your spot is locked, and one signup covers ramya flow early access too. we'll email you the moment your beta invite is ready — no spam, ever.",
    "",
    "— team ramya · ramyaai.tech",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "ramya ai <onboarding@resend.dev>",
        to: [email],
        subject: "you're on the ramya waitlist ✦",
        html,
        text,
      }),
    });
    if (!res.ok) {
      console.error(
        `[email] resend rejected welcome email to ${email}:`,
        res.status,
        await res.text().catch(() => ""),
      );
      return false;
    }
    return true;
  } catch (err) {
    // never let email failures break the signup flow
    console.error("[email] welcome email failed:", err);
    return false;
  }
}