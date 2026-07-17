const fs = require("fs");
const path = require("path");

const BRANCHES = ["Temas", "Bumiaji", "Dau"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const MONTH_NAMES_FULL = ["Januari", "Februari", "Maret", "April", "Mei", "Juni"];

function pad(n) { return n < 10 ? "0" + n : "" + n; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
const AREA_NAMES = ["PAPA", "ORMO", "BSUL", "ETIK", "LOCA", "LAJA", "SURA", "KRBT", "MABA", "RITI", "GADA", "FABO", "DAMA", "LAHO", "GOJO"];
function pick(arr, i) { return arr[i % arr.length]; }

const AREA_DATA = [];
let id = 1;
BRANCHES.forEach((branch, bi) => {
  const monthsForBranch = MONTHS.slice(0, 6);
  monthsForBranch.forEach((month, mi) => {
    const name = pick(AREA_NAMES, bi + mi);
    const primaryId = id++;
    const openDay = pad(randInt(1, 28));
    AREA_DATA.push({
      id: primaryId,
      branch: branch,
      area_name: name,
      area_code: "AR-" + String(primaryId).padStart(3, "0"),
      is_primary: 1,
      area_primary_id: null,
      open_date: openDay + "-" + month + "-26",
      customer_active: randInt(40, 120),
      customer_isolir: randInt(3, 20),
      customer_terminate: randInt(0, 8),
      fasum: randInt(2, 6)
    });

    const overlayId = id++;
    AREA_DATA.push({
      id: overlayId,
      branch: branch,
      area_name: name + " - Overlay",
      area_code: "AR-" + String(overlayId).padStart(3, "0"),
      is_primary: 0,
      area_primary_id: primaryId,
      open_date: openDay + "-" + month + "-26",
      customer_active: randInt(10, 50),
      customer_isolir: randInt(1, 10),
      customer_terminate: randInt(0, 4),
      fasum: randInt(1, 4)
    });
  });
});

function toCSV(arr) {
  if (!arr.length) return "";
  const keys = Object.keys(arr[0]);
  const esc = (v) => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') || s.includes("\n") ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  return keys.join(",") + "\n" + arr.map(r => keys.map(k => esc(r[k])).join(","))
    .join("\n");
}

const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const areaTarget = BRANCHES.map((b, bi) => {
  const branchData = AREA_DATA.filter(a => a.branch === b && a.is_primary === 1);
  const realizedCount = branchData.length;
  const target = (bi + 1) * 2; // minimal 2 per month up to current month (6 max), sebenarnya sampai bulan saat ini?
  return {
    branch: b,
    target: target,
    realized: realizedCount
  };
});

fs.writeFileSync(path.join(DATA_DIR, "areas.csv"), toCSV(AREA_DATA), "utf8");
fs.writeFileSync(path.join(DATA_DIR, "area_targets.csv"), toCSV(areaTarget), "utf8");

console.log("Regenerated areas.csv (" + AREA_DATA.length + " rows)");
console.log("Regenerated area_targets.csv (" + areaTarget.length + " rows)");
