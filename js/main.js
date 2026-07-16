/**
 * =====================================================================
 *  MAIN.JS
 *  Merender konten dari PROFILE (js/profile-data.js) dan PROJECTS
 *  (js/projects-data.js) ke dalam halaman. Jangan perlu diedit kecuali
 *  kamu ingin mengubah cara tampilannya, bukan isinya.
 * =====================================================================
 */
(function () {
  // ---------- ISI KARTU PROFIL ----------
  document.getElementById("brandName").textContent = PROFILE.brandName;
  document.getElementById("navAvatar").src = PROFILE.avatar;
  document.getElementById("introPhoto").src = PROFILE.avatar;
  document.getElementById("statusPill").textContent = "● " + PROFILE.status;
  document.getElementById("resumeLink").href = PROFILE.resumeLink;
  document.getElementById("introName").textContent = PROFILE.name;
  document.getElementById("introRole").textContent = PROFILE.role;

  document.getElementById("greetingName").textContent = PROFILE.greetingName;
  document.getElementById("pageDescription").textContent = PROFILE.pageDescription;

  const highlightRow = document.getElementById("highlightRow");
  PROFILE.highlights.forEach((h) => {
    const el = document.createElement("div");
    el.className = "highlight-pill";
    el.innerHTML = `<strong>${h.value}</strong><span>${h.label}</span>`;
    highlightRow.appendChild(el);
  });

  document.getElementById("skillsTitle").textContent = PROFILE.skillsTitle;
  const skillsCloud = document.getElementById("skillsCloud");
  PROFILE.skills.forEach((s) => {
    const tag = document.createElement("span");
    tag.className = "skill-tag";
    tag.textContent = s;
    skillsCloud.appendChild(tag);
  });

  document.getElementById("ctaTitle").textContent = PROFILE.ctaTitle;
  document.getElementById("ctaText").textContent = PROFILE.ctaText;
  const ctaButton = document.getElementById("ctaButton");
  ctaButton.textContent = "★ " + PROFILE.ctaButtonLabel;
  ctaButton.href = PROFILE.ctaButtonLink;

  const ctaSocials = document.getElementById("ctaSocials");
  PROFILE.socials.forEach((s) => {
    const a = document.createElement("a");
    a.href = s.link;
    a.textContent = s.label;
    a.target = "_blank";
    a.rel = "noopener";
    ctaSocials.appendChild(a);
  });

  // ---------- ISI KARTU FILTER ----------
  const categorySelect = document.getElementById("categorySelect");
  const categories = [...new Set(PROJECTS.map((p) => p.category))];
  categories.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    categorySelect.appendChild(opt);
  });

  document.getElementById("totalProjectsValue").textContent = PROJECTS.length;
  const latestDate = PROJECTS.map((p) => p.date).sort().reverse()[0];
  document.getElementById("lastUpdateValue").textContent = latestDate || "—";

  // ---------- RENDER TIKET PROYEK ----------
  const ticketGrid = document.getElementById("ticketGrid");
  const emptyState = document.getElementById("emptyState");

  // Membuat pola dekoratif ala QR code, berbeda-beda tiap kode proyek
  function fakeQrPattern(seedText) {
    let seed = 0;
    for (let i = 0; i < seedText.length; i++) seed += seedText.charCodeAt(i) * (i + 1);
    let cells = "";
    for (let i = 0; i < 49; i++) {
      seed = (seed * 9301 + 49297) % 233280;
      const on = seed / 233280 > 0.45;
      cells += `<span class="${on ? "on" : ""}"></span>`;
    }
    return cells;
  }

  function renderTicket(p) {
    const el = document.createElement("a");
    el.className = "ticket";
    el.href = p.link;
    el.innerHTML = `
      <div class="ticket__stub">
        <div class="ticket__qr">${fakeQrPattern(p.code + p.title)}</div>
      </div>
      <div class="ticket__body">
        <span class="ticket__code">${p.code}</span>
        <h3 class="ticket__title">${p.title}</h3>
        <div class="ticket__route">
          <span class="ticket__point"></span>
          <span class="ticket__line"></span>
          <span class="ticket__plane">✈</span>
          <span class="ticket__line"></span>
          <span class="ticket__point"></span>
        </div>
        <div class="ticket__endpoints">
          <div><strong>${p.from}</strong><span>Mulai</span></div>
          <span class="ticket__badge">${p.badge}</span>
          <div class="ticket__end-right"><strong>${p.to}</strong><span>Hasil</span></div>
        </div>
        <div class="ticket__meta">
          <div><span>Dibuat</span><strong>${p.date}</strong></div>
          <div><span>Kategori</span><strong>${p.category}</strong></div>
          <div><span>Tools</span><strong>${p.tools}</strong></div>
          <div><span>Status</span><strong>${p.status}</strong></div>
        </div>
      </div>
    `;
    return el;
  }

  function renderAll(list) {
    ticketGrid.innerHTML = "";
    if (list.length === 0) {
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;
    list.forEach((p) => ticketGrid.appendChild(renderTicket(p)));
  }

  renderAll(PROJECTS);

  // ---------- PENCARIAN & FILTER ----------
  function applyFilters() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const category = categorySelect.value;
    const filtered = PROJECTS.filter((p) => {
      const matchesCategory = category === "all" || p.category === category;
      const matchesQuery =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.tools.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
    renderAll(filtered);
  }

  document.getElementById("searchBtn").addEventListener("click", applyFilters);
  document.getElementById("searchInput").addEventListener("keyup", (e) => {
    if (e.key === "Enter") applyFilters();
  });
  categorySelect.addEventListener("change", applyFilters);
})();
