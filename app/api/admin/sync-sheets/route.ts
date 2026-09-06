import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { bulkSyncToSheet } from "@/lib/sheets";
import { getAllRows, markAllSynced, toSheetRow } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

/** full reconcile: rewrite the entire sheet from the database */
export async function POST() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "unauthorized." }, { status: 401 });
  }

  try {
    const rows = await getAllRows();
    const ok = await bulkSyncToSheet(rows.map(toSheetRow));
    if (!ok) {
      return NextResponse.json(
        { ok: false, error: "sheets sync failed — check SHEETS_WEBAPP_URL in your env." },
        { status: 502 },
      );
    }
    await markAllSynced();
    return NextResponse.json({ ok: true, synced: rows.length });
  } catch (err) {
    console.error("[admin] sheets sync failed:", err);
    return NextResponse.json(
      { ok: false, error: "unexpected error during sync." },
      { status: 500 },
    );
  }
}
