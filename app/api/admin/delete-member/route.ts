import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { deleteMember } from "@/lib/waitlist";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * delete a waitlist member (admin console). the db row is removed always;
 * if SUPABASE_SERVICE_ROLE_KEY is set, the matching supabase auth user is
 * deleted too — otherwise a google member could simply sign in again and
 * rejoin with a fresh position.
 */
export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "unauthorized." }, { status: 401 });
  }

  let body: { id?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid request." }, { status: 400 });
  }

  const id = Number(body.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ ok: false, error: "member id required." }, { status: 400 });
  }

  try {
    const row = await deleteMember(id);
    if (!row) {
      return NextResponse.json({ ok: false, error: "member not found." }, { status: 404 });
    }

    // best-effort: remove the supabase auth user so google members can't rejoin
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (row.source === "google" && serviceKey && url) {
      try {
        const supabaseAdmin = createClient(url, serviceKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });
        const { data } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
        const user = data?.users?.find(
          (u) => u.email?.trim().toLowerCase() === row.email,
        );
        if (user) await supabaseAdmin.auth.admin.deleteUser(user.id);
      } catch (err) {
        console.warn("[admin] supabase auth user delete skipped:", err);
      }
    }

    return NextResponse.json({ ok: true, email: row.email });
  } catch (err) {
    console.error("[admin] member delete failed:", err);
    return NextResponse.json(
      { ok: false, error: "unexpected error during delete." },
      { status: 500 },
    );
  }
}