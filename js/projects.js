(function () {
	"use strict";

	/* =========================================================================
	 * DATA — EDIT DI SINI SAJA
	 * Semua isi popup "About" dan "Project" diambil dari sini. Tidak perlu
	 * menyentuh HTML/CSS untuk mengganti teks, menambah/menghapus skill,
	 * atau menambah/menghapus project.
	 * ========================================================================= */

	/* ---- Palet warna, dipakai bergiliran (cycle) untuk elemen interaktif ---- */
	var PALETTE = [
		"#6c5ce7", // ungu
		"#00b894", // hijau
		"#0984e3", // biru
		"#e17055", // oranye
		"#e84393", // pink
		"#fdcb6e", // kuning
		"#00cec9", // teal
		"#d63031"  // merah
	];

	window.aboutData = {
		greeting: "Halo, saya Mualnudarza \uD83D\uDC4B",
		tagline: "Business Analyst & Frontend Enthusiast \u2014 suka merapikan proses bisnis sekaligus mengutak-atik interface.",
		heroColors: ["#6c5ce7", "#00cec9"], // gradient hero, boleh diganti 2 warna hex apa saja

		/* kotak statistik kecil di bawah hero, boleh ditambah/dikurangi bebas */
		stats: [
			{ value: "BRD/SRA", label: "ERP Documentation" },
			{ value: "AHP App", label: "Decision Tool" },
			{ value: "S2", label: "Management" }
		],

		/* daftar skill/minat, tiap item otomatis dapat warna dari PALETTE */
		skills: [
			"Business Analysis",
			"ERP Documentation",
			"Frontend Dev",
			"JavaScript",
			"WebGL",
			"UI/UX Prototyping",
			"Personal Finance Systems",
			"Academic Writing"
		],

		/* tombol/link di bagian bawah about, boleh ditambah/dikurangi bebas */
		links: [
			{ label: "Github", url: "https://github.com/Mualnudarza", color: "#24292e" }
		]
	};

	window.projectsData = [
		{
			category: "Project Web (Prototype)",
			items: [
				{
					name: "AHP - Analytic Hierarchy Process",
					desc: "Perhitungan AHP untuk menentukan prioritas alternatif berdasarkan kriteria yang telah ditentukan.",
					path: "projects/AHP/index.html"
				},
				{
					name: "ERP - SPVR",
					desc: "Prototype ERP untuk SPVR (Supervisor Regional) yang digunakan untuk memantau kinerja dan laporan dari berbagai cabang.",
					path: "projects/ERP-SPVR/index.html"
				},
				{
					name: "Gdevelop",
					desc: "Game development project menggunakan Gdevelop.",
					path: "projects/project-3/index.html"
				}
			]
		},
		{
			category: "Project Business Analyst",
			items: [
				{
					name: "BRD - ERP Mitra",
					desc: "Dokumen kebutuhan bisnis untuk sistem manajemen mitra, mencakup aturan billing dan floor price.",
					path: "projects/BRD-ERP-Mitra/index.html"
				}
			]
		}
	];

	/* ========================================================================= */
	/* ================= DI BAWAH INI LOGIC, TIDAK PERLU DIUBAH ================= */
	/* ========================================================================= */

	function colorAt(i) {
		return PALETTE[i % PALETTE.length];
	}

	function el(tag, className, html) {
		var e = document.createElement(tag);
		if (className) e.className = className;
		if (html !== undefined) e.innerHTML = html;
		return e;
	}

	/* ---- render: About ---- */
	function renderAbout(container) {
		container.innerHTML = "";

		var hero = el("div", "about-hero");
		hero.style.setProperty("--about-c1", aboutData.heroColors[0] || "#6c5ce7");
		hero.style.setProperty("--about-c2", aboutData.heroColors[1] || "#00cec9");
		hero.appendChild(el("h3", null, aboutData.greeting));
		hero.appendChild(el("p", null, aboutData.tagline));
		container.appendChild(hero);

		if (aboutData.stats && aboutData.stats.length) {
			var stats = el("div", "about-stats");
			aboutData.stats.forEach(function (s, i) {
				var box = el("div", "about-stat");
				box.style.background = colorAt(i);
				box.appendChild(el("span", "about-stat-value", s.value));
				box.appendChild(el("span", "about-stat-label", s.label));
				stats.appendChild(box);
			});
			container.appendChild(stats);
		}

		if (aboutData.skills && aboutData.skills.length) {
			container.appendChild(el("h4", "about-section-title", "Fokus & Minat"));
			var skillsWrap = el("div", "about-skills");
			aboutData.skills.forEach(function (skill, i) {
				var chip = el("span", "about-skill", skill);
				chip.style.background = colorAt(i + 3);
				skillsWrap.appendChild(chip);
			});
			container.appendChild(skillsWrap);
		}

		if (aboutData.links && aboutData.links.length) {
			container.appendChild(el("h4", "about-section-title", "Terhubung"));
			var linksWrap = el("div", "about-links");
			aboutData.links.forEach(function (link, i) {
				var a = el("a", "about-link-btn", link.label);
				a.href = link.url;
				a.target = "_blank";
				a.rel = "noopener noreferrer";
				a.style.background = link.color || colorAt(i);
				linksWrap.appendChild(a);
			});
			container.appendChild(linksWrap);
		}
	}

	/* ---- render: Projects ---- */
	function renderProjects(container) {
		container.innerHTML = "";
		container.appendChild(el("h3", "projects-modal-heading", "Projects"));
		container.appendChild(el("p", "projects-modal-sub", "Kumpulan prototype & dokumen kerja. Klik salah satu untuk membuka."));

		window.projectsData.forEach(function (group, groupIndex) {
			var groupColor = colorAt(groupIndex * 2);
			var groupEl = el("div", "pj-group");

			var title = el("span", "pj-group-title", group.category);
			title.style.background = groupColor;
			groupEl.appendChild(title);

			var grid = el("div", "pj-grid");
			group.items.forEach(function (p, i) {
				var cardColor = colorAt(groupIndex * 2 + i + 1);
				var card = el("div", "pj-card");
				card.style.setProperty("--pj-color", cardColor);

				card.appendChild(el("span", "pj-card-index", String(i + 1).padStart(2, "0")));
				card.appendChild(el("h4", "pj-card-name", p.name));
				card.appendChild(el("p", "pj-card-desc", p.desc || ""));

				var link = el("a", "pj-card-link", "Buka Project \u2192");
				link.href = p.path;
				link.target = "_blank";
				link.rel = "noopener noreferrer";
				card.appendChild(link);

				grid.appendChild(card);
			});

			groupEl.appendChild(grid);
			container.appendChild(groupEl);
		});
	}

	/* ---- modal open/close plumbing ---- */
	var overlay, box, content, closeBtn;
	var lastFocused = null;

	function openModal(renderFn) {
		if (!overlay) return;
		lastFocused = document.activeElement;
		renderFn(content);
		overlay.classList.add("open");
		document.body.style.overflow = "hidden";
	}

	function closeModal() {
		if (!overlay || !overlay.classList.contains("open")) return;
		overlay.classList.remove("open");
		document.body.style.overflow = "";
		if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
	}

	function init() {
		overlay = document.getElementById("modal-overlay");
		box = document.getElementById("modal-box");
		content = document.getElementById("modal-content");
		closeBtn = document.getElementById("modal-close");
		if (!overlay || !box || !content || !closeBtn) return;

		var aboutTrigger = document.getElementById("about-trigger");
		var projectTrigger = document.getElementById("project-trigger");

		if (aboutTrigger) {
			aboutTrigger.addEventListener("click", function (e) {
				e.preventDefault();
				openModal(renderAbout);
			});
		}

		if (projectTrigger) {
			projectTrigger.addEventListener("click", function (e) {
				e.preventDefault();
				openModal(renderProjects);
			});
		}

		closeBtn.addEventListener("click", closeModal);
		overlay.addEventListener("click", function (e) {
			if (e.target === overlay) closeModal();
		});
		document.addEventListener("keydown", function (e) {
			if (e.key === "Escape") closeModal();
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();