import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { getMembersWithoutWelcome, markWelcomeSent } from "@/lib/waitlist";
import { sendWaitlistWelcome, emailConfigured } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * backfill — send the welcome email to every member who joined before the
 * email feature went live (welcome_email_sent_at is null). idempotent: only
 * members without the marker are contacted, and each is marked after a
 * confirmed send, so re-running never double-sends.
 */
export async function POST() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "unauthorized." }, { status: 401 });
  }

  if (!emailConfigured()) {
    return NextResponse.json(
      { ok: false, error: "RESEND_API_KEY is not set — welcome emails are disabled." },
      { status: 400 },
    );
  }

  try {
    const rows = await getMembersWithoutWelcome();
    let sent = 0;
    let failed = 0;
    // sequential on purpose — resend's free tier allows 2 requests/second
    for (const row of rows) {
      const ok = await sendWaitlistWelcome({
        email: row.email,
        name: row.name,
        position: row.position,
      });
      if (ok) {
        await markWelcomeSent([row.id]);
        sent++;
      } else {
        failed++;
      }
    }
    return NextResponse.json({ ok: true, sent, failed, total: rows.length });
  } catch (err) {
    console.error("[admin] welcome backfill failed:", err);
    return NextResponse.json(
      { ok: false, error: "unexpected error during backfill." },
      { status: 500 },
    );
  }
}