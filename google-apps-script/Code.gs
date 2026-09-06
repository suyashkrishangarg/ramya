/**
 * ramya ai · waitlist → google sheets realtime mirror
 * ─────────────────────────────────────────────────────
 * setup (also in README · step 3):
 *   1. create a google sheet, e.g. "ramya ai — waitlist"
 *   2. extensions → apps script → delete everything → paste this file
 *   3. deploy → new deployment → type: web app
 *        · execute as: me
 *        · who has access: anyone
 *   4. copy the web app url → set it as SHEETS_WEBAPP_URL (vercel env var)
 *   5. every website signup appends a row instantly (realtime).
 *      the admin console "sync to sheets" button rewrites the full sheet.
 */

var SHEET_NAME = 'waitlist';
var HEADERS = ['position', 'email', 'name', 'source', 'google_id', 'joined_at'];

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

    if (body.type === 'bulk' && body.rows) {
      // full reconcile from the admin console
      sheet.clear();
      sheet.appendRow(HEADERS);
      body.rows.forEach(function (r) {
        sheet.appendRow(rowToArray(r));
      });
    } else if (body.row) {
      // realtime single-row append from a new signup
      sheet.appendRow(rowToArray(body.row));
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json({ ok: true, service: 'ramya ai · waitlist sync', status: 'live' });
}

function rowToArray(r) {
  return [r.position, r.email, r.name, r.source, r.google_id, r.joined_at];
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
