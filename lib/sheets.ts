/**
 * realtime google sheets mirror.
 * every signup POSTs one row to a google apps script web app attached to
 * your sheet — see google-apps-script/Code.gs + README step 3.
 * all calls are best-effort: a sheets outage must never block a signup.
 */

export type SheetRow = {
  position: number | null;
  email: string;
  name: string | null;
  source: string;
  google_id: string | null;
  joined_at: string;
};

/** server-side check for whether the sheets mirror is configured */
export function sheetsConfigured(): boolean {
  const url = process.env.SHEETS_WEBAPP_URL;
  return Boolean(url && url.startsWith("http"));
}

function webappUrl(): string | null {
  const url = process.env.SHEETS_WEBAPP_URL?.trim();
  if (!url) return null;
  if (!url.startsWith("http")) {
    console.warn("[sheets] SHEETS_WEBAPP_URL is set but does not start with http://");
    return null;
  }
  return url;
}

async function post(payload: unknown): Promise<boolean> {
  const url = webappUrl();
  if (!url) {
    console.warn("[sheets] push skipped — SHEETS_WEBAPP_URL not configured");
    return false;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
      signal: AbortSignal.timeout(9_000),
    });
    if (!res.ok) {
      const text = await res.text();
      console.warn(`[sheets] web app returned ${res.status}: ${text.slice(0, 200)}`);
    } else {
      console.log("[sheets] push ok");
    }
    return res.ok;
  } catch (err) {
    console.warn(`[sheets] push failed: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
}

/** append a single row (fires on every new signup → realtime) */
export function pushRowToSheet(row: SheetRow): Promise<boolean> {
  return post({ type: "append", row });
}

/** full reconcile — clears the sheet tab and rewrites every row */
export function bulkSyncToSheet(rows: SheetRow[]): Promise<boolean> {
  return post({ type: "bulk", rows });
}
