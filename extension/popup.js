// HSN Lookup India — Chrome extension popup.
// Loads the full public dataset once, caches in chrome.storage.local,
// refreshes every 7 days. All search runs locally, offline.

const API_URL = "https://hsnlookup.in/api/hsn.json";
const CACHE_KEY = "hsn_dataset_v1";
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const qInput = document.getElementById("q");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");

let dataset = null; // [{hsn, description, chapter, bcd, sws, igst, cess}, ...]

function setStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.classList.toggle("error", !!isError);
}

async function loadDataset() {
  try {
    const cached = await chrome.storage.local.get(CACHE_KEY);
    const entry = cached[CACHE_KEY];
    const now = Date.now();
    if (entry && entry.fetchedAt && now - entry.fetchedAt < CACHE_TTL_MS && Array.isArray(entry.data)) {
      dataset = entry.data;
      setStatus(`${dataset.length.toLocaleString("en-IN")} HSN codes loaded (offline)`);
      return;
    }
  } catch (e) {
    // fall through to fetch
  }

  setStatus("Loading 12,136 HSN codes…");
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const payload = await res.json();
    dataset = payload.data || [];
    await chrome.storage.local.set({
      [CACHE_KEY]: { fetchedAt: Date.now(), data: dataset },
    });
    setStatus(`${dataset.length.toLocaleString("en-IN")} HSN codes loaded`);
  } catch (err) {
    setStatus(`Couldn't load data: ${err.message}. Check connection and retry.`, true);
  }
}

function effectiveRate(c) {
  const bcd = (c.bcd || 0) / 100;
  const sws = (c.sws || 0) / 100;
  const cess = (c.cess || 0) / 100;
  const igst = (c.igst || 0) / 100;
  const av = 1;
  const bcdAmt = av * bcd;
  const swsAmt = bcdAmt * sws;
  const cessAmt = (av + bcdAmt) * cess;
  const igstAmt = (av + bcdAmt + swsAmt + cessAmt) * igst;
  const total = bcdAmt + swsAmt + cessAmt + igstAmt;
  return (total / av * 100).toFixed(2);
}

function render(rows) {
  resultsEl.innerHTML = "";
  if (!rows.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "No matches. Try a partial HSN (e.g. 8517) or a product name.";
    resultsEl.appendChild(empty);
    return;
  }
  const frag = document.createDocumentFragment();
  for (const c of rows) {
    const li = document.createElement("li");
    const eff = effectiveRate(c);
    li.innerHTML = `
      <div class="hsn-code">${escapeHtml(c.hsn)}</div>
      <div class="hsn-desc">${escapeHtml(c.description || "")}</div>
      <div class="rates">
        <span class="rate">BCD <strong>${c.bcd ?? 0}%</strong></span>
        <span class="rate">IGST <strong>${c.igst ?? 0}%</strong></span>
        <span class="rate">SWS <strong>${c.sws ?? 0}%</strong></span>
        ${c.cess ? `<span class="rate">Cess <strong>${c.cess}%</strong></span>` : ""}
        <span class="rate">Effective <strong>${eff}%</strong></span>
      </div>
      <a class="open-link" href="https://hsnlookup.in/hsn/${encodeURIComponent(c.hsn)}/" target="_blank" rel="noopener">Open on hsnlookup.in →</a>
    `;
    frag.appendChild(li);
  }
  resultsEl.appendChild(frag);
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function search(q) {
  if (!dataset) return;
  const s = q.trim().toLowerCase();
  if (!s) {
    render([]);
    return;
  }
  const digits = s.replace(/\D/g, "");
  const hits = [];
  // First pass: HSN prefix/exact match
  if (digits.length >= 2) {
    for (const c of dataset) {
      if (c.hsn.startsWith(digits)) hits.push(c);
      if (hits.length >= 50) break;
    }
  }
  // Second pass: description substring (only if we haven't filled up)
  if (hits.length < 30) {
    for (const c of dataset) {
      if (hits.includes(c)) continue;
      if ((c.description || "").toLowerCase().includes(s)) hits.push(c);
      if (hits.length >= 50) break;
    }
  }
  render(hits.slice(0, 50));
}

qInput.addEventListener("input", (e) => search(e.target.value));
qInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const first = resultsEl.querySelector("li a");
    if (first) first.click();
  }
});

loadDataset();
