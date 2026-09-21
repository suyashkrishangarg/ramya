import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { grantChatAccess, listChatAccess, revokeChatAccess } from "@/lib/chat-access";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** manage chat beta access (admin console) */
export async function GET(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, error: "unauthorized." }, { status: 401 });
  }
  void clientIp(req.headers);
  if (!rateLimit("adm-chat-get", 60, 60_000)) {
    return NextResponse.json({ ok: false, error: "slow down." }, { status: 429 });
  }
  const rows = await listChatAccess();
  return NextResponse.json({
    ok: true,
    access: rows.map((r) => ({
      email: r.email,
      grantedAt: r.grantedAt ? r.grantedAt.toISOString() : null,
    })),
  });
}

/** grant an email */
export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, error: "unauthorized." }, { status: 401 });
  }
  if (!rateLimit("adm-chat-post", 30, 60_000)) {
    return NextResponse.json({ ok: false, error: "slow down." }, { status: 429 });
  }

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid request." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "invalid email." }, { status: 400 });
  }

  try {
    await grantChatAccess(email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin] chat access grant failed:", err);
    return NextResponse.json({ ok: false, error: "could not grant access." }, { status: 500 });
  }
}

/** revoke an email */
export async function DELETE(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, error: "unauthorized." }, { status: 401 });
  }
  if (!rateLimit("adm-chat-del", 30, 60_000)) {
    return NextResponse.json({ ok: false, error: "slow down." }, { status: 429 });
  }

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid request." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ ok: false, error: "invalid email." }, { status: 400 });
  }

  try {
    await revokeChatAccess(email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin] chat access revoke failed:", err);
    return NextResponse.json({ ok: false, error: "could not revoke access." }, { status: 500 });
  }
}
