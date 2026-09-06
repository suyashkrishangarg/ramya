import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { KNOWN_LINKS, saveSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

/** save site links (admin console → site links editor) */
export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "unauthorized." }, { status: 401 });
  }

  let body: { settings?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid request." }, { status: 400 });
  }

  const allowed = new Set(KNOWN_LINKS.map((l) => l.key));
  const clean: Record<string, string> = {};
  for (const [key, value] of Object.entries(body.settings ?? {})) {
    if (!allowed.has(key)) continue;
    if (typeof value !== "string") continue;
    if (value && !/^https?:\/\/.+/i.test(value.trim())) {
      return NextResponse.json(
        { ok: false, error: `"${key}" must be a full url starting with http(s)://` },
        { status: 400 },
      );
    }
    clean[key] = value;
  }

  try {
    const saved = await saveSettings(clean);
    return NextResponse.json({ ok: true, saved });
  } catch (err) {
    console.error("[admin] settings save failed:", err);
    return NextResponse.json(
      { ok: false, error: "could not save settings." },
      { status: 500 },
    );
  }
}
