import { NextRequest, NextResponse } from "next/server";
import { adminCredentialsOk, createAdminSession, setAdminCookie } from "@/lib/session";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!rateLimit(`adm:${clientIp(req.headers)}`, 8, 300_000)) {
    return NextResponse.json(
      { ok: false, error: "too many attempts — try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid request." }, { status: 400 });
  }

  if (!adminCredentialsOk(body.email, body.password)) {
    return NextResponse.json({ ok: false, error: "invalid credentials." }, { status: 401 });
  }

  const token = await createAdminSession((body.email ?? "").trim().toLowerCase());
  await setAdminCookie(token);
  return NextResponse.json({ ok: true });
}
