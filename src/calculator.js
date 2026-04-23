// Served as-is at /assets/calculator.js. Runs in the browser.
(() => {
  const form = document.getElementById("calc-form");
  const hsnInput = document.getElementById("calc-hsn");
  const hsnDesc = document.getElementById("calc-hsn-desc");
  const rateBcd = document.getElementById("calc-bcd");
  const rateIgst = document.getElementById("calc-igst");
  const rateSws = document.getElementById("calc-sws");
  const rateCess = document.getElementById("calc-cess");
  const avInput = document.getElementById("calc-av");
  const out = document.getElementById("calc-out");
  const hsnHelp = document.getElementById("calc-hsn-help");
  if (!form) return;

  let rates = null;
  let ratesLoading = null;

  async function loadRates() {
    if (rates) return rates;
    if (!ratesLoading) {
      ratesLoading = fetch("/assets/rates.json")
        .then((r) => r.json())
        .then((d) => (rates = d));
    }
    return ratesLoading;
  }

  const inr = (n) =>
    "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });

  function parseRate(v) {
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }

  function compute() {
    const av = parseRate(avInput.value);
    const bcd = parseRate(rateBcd.value);
    const sws = parseRate(rateSws.value);
    const igst = parseRate(rateIgst.value);
    const cess = parseRate(rateCess.value);
    if (av <= 0) {
      out.innerHTML = `<p class="calc-hint">Enter an assessable value to see the landed-cost breakdown.</p>`;
      return;
    }
    const bcdAmt = +(av * (bcd / 100)).toFixed(2);
    const swsAmt = +(bcdAmt * (sws / 100)).toFixed(2);
    const cessAmt = +((av + bcdAmt) * (cess / 100)).toFixed(2);
    const igstBase = av + bcdAmt + swsAmt + cessAmt;
    const igstAmt = +(igstBase * (igst / 100)).toFixed(2);
    const total = +(bcdAmt + swsAmt + cessAmt + igstAmt).toFixed(2);
    const landed = +(av + total).toFixed(2);
    const eff = av > 0 ? +((total / av) * 100).toFixed(2) : 0;
    out.innerHTML = `
<table>
  <tr><td>Assessable Value</td><td class="num">${inr(av)}</td></tr>
  <tr><td>BCD @ ${bcd}%</td><td class="num">${inr(bcdAmt)}</td></tr>
  <tr><td>SWS @ ${sws}% of BCD</td><td class="num">${inr(swsAmt)}</td></tr>
  ${cess ? `<tr><td>Compensation Cess @ ${cess}%</td><td class="num">${inr(cessAmt)}</td></tr>` : ""}
  <tr><td>IGST @ ${igst}%</td><td class="num">${inr(igstAmt)}</td></tr>
  <tr class="total"><td>Total Duty</td><td class="num">${inr(total)}</td></tr>
  <tr class="total"><td>Landed Cost</td><td class="num">${inr(landed)}</td></tr>
  <tr><td>Effective Duty Rate</td><td class="num">${eff}%</td></tr>
</table>`;
  }

  async function applyHsn(code) {
    const codeClean = String(code).replace(/\s/g, "");
    hsnInput.value = codeClean;
    await loadRates();
    const match = rates[codeClean];
    if (match) {
      hsnDesc.textContent = match.description;
      rateBcd.value = match.bcd;
      rateIgst.value = match.igst;
      rateSws.value = match.sws;
      rateCess.value = match.cess || 0;
      hsnHelp.innerHTML = `Loaded rates for <a href="/hsn/${codeClean}/">HSN ${codeClean}</a>. You can edit the numbers below for sensitivity analysis.`;
    } else {
      hsnDesc.textContent = "";
      hsnHelp.innerHTML = `Rates for HSN ${codeClean} aren't in our verified dataset yet. Enter the rates manually from the <a href="https://www.icegate.gov.in/" rel="nofollow noopener" target="_blank">ICEGATE Customs Duty Calculator</a> or the CBIC tariff, and compute below.`;
    }
    compute();
  }

  // Pre-fill from ?hsn= query param.
  const params = new URLSearchParams(window.location.search);
  if (params.get("hsn")) applyHsn(params.get("hsn"));

  // Expose applyHsn so the search UI can call it.
  window.__calcApplyHsn = applyHsn;

  [rateBcd, rateIgst, rateSws, rateCess, avInput].forEach((el) =>
    el.addEventListener("input", compute),
  );

  hsnInput.addEventListener("change", (e) => applyHsn(e.target.value));
  hsnInput.addEventListener("blur", (e) => {
    if (e.target.value) applyHsn(e.target.value);
  });
})();
