import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import {
  EMAIL_RE,
  getWaitlistCount,
  joinWaitlist,
  toSheetRow,
} from "@/lib/waitlist";
import { pushRowToSheet } from "@/lib/sheets";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/** live waitlist counter (used by the hero capsule) */
export async function GET() {
  try {
    const count = await getWaitlistCount();
    return NextResponse.json({ ok: true, count });
  } catch {
    return NextResponse.json({ ok: false, count: 0 }, { status: 500 });
  }
}

/** join the waitlist */
export async function POST(req: NextRequest) {
  if (!rateLimit(`wl:${clientIp(req.headers)}`, 10, 60_000)) {
    return NextResponse.json(
      { ok: false, error: "too many requests — try again in a minute." },
      { status: 429 },
    );
  }

  let body: { email?: string; name?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid request." }, { status: 400 });
  }

  // honeypot — bots fill hidden fields; pretend success and move on
  if (body.website) {
    return NextResponse.json({ ok: true, position: 0, alreadyRegistered: false });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "enter a valid email address." },
      { status: 400 },
    );
  }

  try {
    const result = await joinWaitlist({ email, name: body.name?.trim() || null });
    // mirror to google sheets after the response is sent — realtime, never blocking
    after(async () => {
      await pushRowToSheet(toSheetRow(result.row));
    });
    const count = await getWaitlistCount();
    return NextResponse.json({
      ok: true,
      position: result.position,
      alreadyRegistered: result.alreadyRegistered,
      count,
    });
  } catch (err) {
    console.error("[waitlist] join failed:", err);
    return NextResponse.json(
      { ok: false, error: "something went wrong on our side — please try again." },
      { status: 500 },
    );
  }
}
