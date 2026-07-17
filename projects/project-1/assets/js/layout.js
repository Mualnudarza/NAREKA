/* =========================================================
   ERP SPVR - SHARED LAYOUT (Navbar + Sidebar)
   Mengikuti struktur & style navbar/sidebar template ERP asli.
   Setiap halaman cukup menset:
     window.BASE        -> path relatif ke root ("" atau "../../")
     window.ACTIVE_MENU  -> key menu yang sedang aktif
   ========================================================= */

function renderLayout() {
  const BASE = window.BASE || "";
  const ACTIVE = window.ACTIVE_MENU || "";

  const isActive = (key) => (ACTIVE === key ? "active" : "");

  const navbarHtml = `
    <header class="navbar navbar-dark sticky-top bg-dark shadow px-3 d-flex justify-content-between align-items-center">
        <a class="navbar-brand fw-bold mb-0 ms-2" href="${BASE}index.html" style="background:none;">
            GriyaNet - Hei, SPVR
        </a>
        <button class="navbar-toggler d-md-none small-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="bg-dark py-1 px-2 header-scroll">
            <span class="mode-dev">MODE PROTOTYPE - Supervisor Regional</span>
            <a href="#" class="menu-link active">Regional Malang Raya</a>
            <button type="button" class="logout-btn" disabled title="Non-fungsional pada prototype">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-log-out me-1"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg> Logout
            </button>
        </div>
    </header>`;

  const item = (href, key, icon, label) => `
    <li class="nav-item">
        <a href="${BASE}${href}" class="nav-link ${isActive(key)}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-${icon}" aria-hidden="true">${ICONS[icon] || ""}</svg>
            ${label}
        </a>
    </li>`;

  const heading = (label) => `
    <div class="border-bottom my-2"></div>
    <h6 class="sidebar-heading px-3 mt-2 mb-1 text-muted">${label}</h6>`;

  const sidebarHtml = `
    <nav id="sidebarMenu" class="col-md-2 col-lg-2 d-md-block sidebar collapse sidebar-admin">
        <div class="position-sticky">
            <ul class="nav flex-column">
                ${item("index.html", "dashboard", "home", "Dashboard")}
                ${heading("Area")}
                ${item("pages/area/open-area.html", "area-open", "map", "Open Area &amp; Overlay")}
                ${heading("Sales")}
                ${item("pages/sales/retention.html", "sales-retention", "users", "Customer Retention")}
                ${heading("Operational &amp; Technical")}
                ${item("pages/operational/psb.html", "op-psb", "chevrons-right", "Modul Operasional &amp; Teknis")}
                ${heading("Monitoring Infrastruktur")}
                <div class="ms-3">
                  ${item("pages/infra-monitoring/monitor-odp.html", "infra-monitoring-odp", "monitor", "Monitor ODP")}
                  ${item("pages/infra-monitoring/list-area-splitter.html", "infra-monitoring-splitter-area", "list", "List Area Splitter")}
                  ${item("pages/infra-monitoring/splitter-no-config.html", "infra-monitoring-splitter-noconfig", "settings", "Splitter No Config")}
                  ${item("pages/infra-monitoring/progress-konfigurasi.html", "infra-monitoring-progress", "activity", "Progress Konfigurasi")}
                  ${item("pages/infra-monitoring/map-access.html", "infra-monitoring-map-access", "map", "Map Access")}
                </div>
                ${heading("Man Power Planning")}
                ${item("pages/manpower/mpp.html", "mpp-main", "users", "Modul Man Power Planning")}
            </ul>
        </div>
    </nav>`;

  // IMPORTANT: use outerHTML (not innerHTML) so the real elements with the
  // Bootstrap column classes (col-md-2, etc.) become direct children of
  // .row. If we only injected innerHTML into the placeholder <div>, the
  // wrapper <div> itself (which has no column class) would be the flex
  // item, causing the sidebar/main content to stack instead of sitting
  // side-by-side.
  const navbarEl = document.getElementById("app-navbar");
  const sidebarEl = document.getElementById("app-sidebar");
  if (navbarEl) navbarEl.outerHTML = navbarHtml;
  if (sidebarEl) sidebarEl.outerHTML = sidebarHtml;
}

const ICONS = {
  "home": '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
  "map": '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line>',
  "users": '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
  "chevrons-right": '<polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline>',
  "tool": '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>',
  "layers": '<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>',
  "check-circle": '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
  "user-check": '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline>',
  "monitor": '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>',
  "list": '<line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>',
  "settings": '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',
  "activity": '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>'
};

document.addEventListener("DOMContentLoaded", renderLayout);
