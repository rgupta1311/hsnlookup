// This file is served as-is at /assets/search.js.
// Do not import anything — runs in the browser.
(() => {
  const input = document.getElementById("hsn-search");
  const box = document.getElementById("hsn-search-results");
  if (!input || !box) return;

  let index = null;
  let loading = null;
  let activeIdx = -1;
  let currentResults = [];

  async function loadIndex() {
    if (index) return index;
    if (!loading) {
      loading = fetch("/assets/search.json")
        .then((r) => r.json())
        .then((d) => {
          index = d;
          return d;
        });
    }
    return loading;
  }

  const typeLabel = { india: "India 8-digit", hs: "HS 6-digit", heading: "Heading", chapter: "Chapter" };
  const typeClass = { india: "india", hs: "hs", heading: "hs", chapter: "hs" };

  function score(item, q, qWords) {
    const code = item.c;
    const desc = (item.d || "").toLowerCase();
    const products = (item.p || "").toLowerCase();
    // Exact code match is king.
    if (code === q) return 1000;
    if (code.startsWith(q)) return 500 - (code.length - q.length);
    // Word-start match in description.
    let s = 0;
    for (const w of qWords) {
      if (!w) continue;
      if (desc.startsWith(w)) s += 80;
      else if (desc.includes(" " + w)) s += 50;
      else if (desc.includes(w)) s += 20;
      if (products.includes(w)) s += 60;
    }
    // Tiny boost for India 8-digit (they have actual duty data).
    if (s > 0 && item.t === "india") s += 15;
    return s;
  }

  function search(q) {
    const ql = q.toLowerCase().trim();
    if (!ql || !index) return [];
    const qWords = ql.split(/\s+/).filter(Boolean);
    const scored = [];
    for (let i = 0; i < index.length; i++) {
      const s = score(index[i], ql, qWords);
      if (s > 0) scored.push([s, index[i]]);
    }
    scored.sort((a, b) => b[0] - a[0]);
    return scored.slice(0, 12).map((x) => x[1]);
  }

  function render(results) {
    currentResults = results;
    activeIdx = -1;
    if (results.length === 0) {
      box.innerHTML = `<div class="search-empty">No matches. Try an HSN number (e.g. 85171300) or a product name.</div>`;
      box.classList.add("open");
      return;
    }
    box.innerHTML = results
      .map(
        (r, i) =>
          `<a href="${r.u}" class="search-result" data-idx="${i}">` +
          `<span class="search-result-code">${r.c}</span>` +
          `<span class="search-result-type ${typeClass[r.t] || "hs"}">${typeLabel[r.t] || r.t}</span>` +
          `<div class="search-result-desc">${escapeHtml(r.d)}</div>` +
          `</a>`,
      )
      .join("");
    box.classList.add("open");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setActive(i) {
    const items = box.querySelectorAll(".search-result");
    items.forEach((el, idx) => el.classList.toggle("active", idx === i));
    if (i >= 0 && items[i]) items[i].scrollIntoView({ block: "nearest" });
    activeIdx = i;
  }

  async function onInput() {
    const q = input.value.trim();
    if (!q) {
      box.classList.remove("open");
      return;
    }
    if (!index) {
      box.innerHTML = `<div class="search-empty">Loading index…</div>`;
      box.classList.add("open");
      await loadIndex();
    }
    render(search(q));
  }

  input.addEventListener("focus", () => {
    loadIndex();
    if (input.value.trim()) onInput();
  });
  input.addEventListener("input", onInput);
  input.addEventListener("keydown", (e) => {
    if (!box.classList.contains("open")) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(Math.min(activeIdx + 1, currentResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(Math.max(activeIdx - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIdx >= 0 && currentResults[activeIdx]) {
        e.preventDefault();
        window.location.href = currentResults[activeIdx].u;
      } else if (currentResults[0]) {
        e.preventDefault();
        window.location.href = currentResults[0].u;
      }
    } else if (e.key === "Escape") {
      box.classList.remove("open");
      input.blur();
    }
  });
  document.addEventListener("click", (e) => {
    if (!box.contains(e.target) && e.target !== input) {
      box.classList.remove("open");
    }
  });

  // Slash to focus search.
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== input && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      input.focus();
    }
  });
})();
