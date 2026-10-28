/**
 * Spot the Slop – results collector.
 * Paste this into Extensions > Apps Script on your results Google Sheet,
 * then deploy it as a web app (see README.md).
 *
 * Players POST their anonymous result when they finish.
 * The presenter view GETs all results every few seconds.
 */

const PLAYS = "Plays";
const RATINGS = "Ratings";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const play = clean_(JSON.parse(e.postData.contents));
    if (!play) return json_({ ok: false, error: "Invalid result" });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const plays = sheet_(ss, PLAYS, ["Time", "Play ID", "Score", "Total", "Answers (JSON)"]);

    // Ignore a retry of a result that already arrived
    if (plays.getLastRow() > 1) {
      const ids = plays.getRange(2, 2, plays.getLastRow() - 1, 1).getValues().flat();
      if (ids.indexOf(play.id) !== -1) return json_({ ok: true, duplicate: true });
    }

    const now = new Date();
    plays.appendRow([now, play.id, play.score, play.total, JSON.stringify(play.answers)]);

    // One row per rating, for your own analysis in Sheets
    const ratings = sheet_(ss, RATINGS, ["Time", "Play ID", "Graphic", "Rating", "Correct"]);
    const rows = play.answers.map(a => [now, play.id, a.id, a.rating, a.correct]);
    if (rows.length) ratings.getRange(ratings.getLastRow() + 1, 1, rows.length, 5).setValues(rows);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PLAYS);
  if (!sheet || sheet.getLastRow() < 2) return json_({ ok: true, plays: [] });
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
  const plays = rows
    .filter(r => r[1])
    .map(r => {
      let answers = [];
      try { answers = JSON.parse(r[4]); } catch (e) {}
      return { score: Number(r[2]) || 0, total: Number(r[3]) || 0, answers: answers };
    });
  return json_({ ok: true, plays: plays });
}

/** Adds a "Spot the Slop" menu to the sheet with a Clear results option. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Spot the Slop")
    .addItem("Clear results", "clearResults")
    .addToUi();
}

function clearResults() {
  const ui = SpreadsheetApp.getUi();
  const answer = ui.alert("Clear all results?", "This deletes every row in Plays and Ratings. Headers stay.", ui.ButtonSet.OK_CANCEL);
  if (answer !== ui.Button.OK) return;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  [PLAYS, RATINGS].forEach(name => {
    const s = ss.getSheetByName(name);
    if (s && s.getLastRow() > 1) s.deleteRows(2, s.getLastRow() - 1);
  });
}

// ---- helpers ----

function clean_(d) {
  if (!d || typeof d !== "object") return null;
  if (typeof d.id !== "string" || !/^[A-Za-z0-9-]{6,40}$/.test(d.id)) return null;
  const score = Math.round(Number(d.score));
  const total = Math.round(Number(d.total));
  if (!(total >= 1 && total <= 100) || !(score >= 0 && score <= total)) return null;
  if (!Array.isArray(d.answers) || d.answers.length > 100) return null;
  const answers = [];
  for (const a of d.answers) {
    if (!a || typeof a.id !== "string" || !/^[A-Za-z0-9_-]{1,40}$/.test(a.id)) return null;
    const rating = Math.round(Number(a.rating));
    if (!(rating >= 0 && rating <= 100)) return null;
    answers.push({ id: a.id, rating: rating, correct: a.correct === true });
  }
  return { id: d.id, score: score, total: total, answers: answers };
}

function sheet_(ss, name, headers) {
  let s = ss.getSheetByName(name);
  if (!s) {
    s = ss.insertSheet(name);
    s.appendRow(headers);
    s.setFrozenRows(1);
  }
  return s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
