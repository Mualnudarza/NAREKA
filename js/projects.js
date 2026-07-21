(function () {
	"use strict";

	/* =========================================================================
	 * KELOLA PROJECT DI SINI
	 * Kelompokkan project ke dalam beberapa kategori. Tiap kategori akan
	 * tampil sebagai barisnya sendiri dengan judul dan scroll horizontal
	 * masing-masing (tidak perlu sentuh HTML/CSS untuk nambah project).
	 *
	 * category : nama kategori/bagian yang ditampilkan sebagai judul baris
	 * items    : daftar project di kategori tsb
	 *   name  : nama project
	 *   desc  : deskripsi singkat (opsional)
	 *   path  : path folder project, contoh "projects/AHP/index.html"
	 * ========================================================================= */
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

	var GESTURE_GAP = 260; // ms jeda dianggap sesi scroll baru

	/* state per kategori: offset scroll, dan info sesi scroll (gesture) */
	var groupState = [];

	function buildGroupState() {
		groupState = window.projectsData.map(function () {
			return { offset: 0, lastWheelTime: 0, gestureStartedAtEdge: false };
		});
	}

	function renderProjects() {
		var container = document.getElementById("projectsGroups");
		if (!container) return;
		container.innerHTML = "";
		buildGroupState();

		window.projectsData.forEach(function (group, groupIndex) {
			var groupEl = document.createElement("div");
			groupEl.className = "projects-group";

			var title = document.createElement("h3");
			title.className = "projects-group-title";
			title.textContent = group.category;

			var viewport = document.createElement("div");
			viewport.className = "projects-viewport";
			viewport.setAttribute("data-group-index", String(groupIndex));

			var track = document.createElement("ul");
			track.className = "projects-track";
			track.setAttribute("data-group-index", String(groupIndex));

			group.items.forEach(function (p, i) {
				var li = document.createElement("li");
				li.className = "project-item";

				var idx = document.createElement("span");
				idx.className = "project-index";
				idx.textContent = String(i + 1).padStart(2, "0");

				var name = document.createElement("h3");
				name.className = "project-name";
				name.textContent = p.name;

				var desc = document.createElement("p");
				desc.className = "project-desc";
				desc.textContent = p.desc || "";

				var link = document.createElement("a");
				link.className = "project-link";
				link.href = p.path;
				link.target = "_blank";
				link.rel = "noopener noreferrer";
				link.textContent = "Open Project \u2192";

				li.appendChild(idx);
				li.appendChild(name);
				li.appendChild(desc);
				li.appendChild(link);
				track.appendChild(li);
			});

			viewport.appendChild(track);
			groupEl.appendChild(title);
			groupEl.appendChild(viewport);
			container.appendChild(groupEl);

			attachViewportWheel(viewport, groupIndex);
		});
	}

	/* ---- state: 0 = intro, 1 = main (card), 2 = projects ---- */
	var stage = 0;
	var isAnimatingStage = false;

	function getTrack(groupIndex) {
		return document.querySelector('.projects-track[data-group-index="' + groupIndex + '"]');
	}

	function getViewport(groupIndex) {
		return document.querySelector('.projects-viewport[data-group-index="' + groupIndex + '"]');
	}

	function maxTrackOffset(groupIndex) {
		var track = getTrack(groupIndex);
		var wrap = getViewport(groupIndex);
		if (!track || !wrap) return 0;
		return Math.max(0, track.scrollWidth - wrap.clientWidth);
	}

	function applyGroupOffset(groupIndex) {
		var track = getTrack(groupIndex);
		var st = groupState[groupIndex];
		if (!track || !st) return;
		var max = maxTrackOffset(groupIndex);
		st.offset = Math.min(Math.max(st.offset, 0), max);
		track.style.transform = "translateX(-" + st.offset + "px)";
	}

	function applyAllGroupOffsets() {
		groupState.forEach(function (_, groupIndex) {
			applyGroupOffset(groupIndex);
		});
	}

	function resetAllGroupGestures() {
		groupState.forEach(function (st) {
			st.lastWheelTime = 0;
			st.gestureStartedAtEdge = false;
		});
	}

	function goToProjects() {
		if (isAnimatingStage || stage !== 1 || typeof anime === "undefined") return;
		isAnimatingStage = true;
		var main = document.querySelector(".content-main");
		var projects = document.querySelector(".content-projects");
		var TOTAL_DURATION = 1100; // sama seperti durasi transisi section 1 -> 2 (switchPage)

		// meniru persis gerakan .content-intro pada transisi section 1 -> 2:
		// translateY polos + fade, tanpa scaleY -- squash/stretch di versi
		// asli hanya dipakai untuk elemen dekoratif kecil (svg.shape), bukan
		// panel selebar layar, jadi tidak dipakai di sini supaya tetap mulus
		anime({
			targets: main,
			duration: TOTAL_DURATION,
			easing: "easeInOutSine",
			translateY: "-100vh",
			opacity: [1, 0.5]
		});

		anime({
			targets: projects,
			duration: TOTAL_DURATION,
			easing: "easeInOutSine",
			translateY: ["100vh", "0vh"],
			opacity: [0, 1],
			complete: function () {
				stage = 2;
				resetAllGroupGestures();
				isAnimatingStage = false;
			}
		});
	}

	function backToMain() {
		if (isAnimatingStage || stage !== 2 || typeof anime === "undefined") return;
		isAnimatingStage = true;
		var main = document.querySelector(".content-main");
		var projects = document.querySelector(".content-projects");
		var TOTAL_DURATION = 1100;

		// persis transisi section 1 -> 2, dibalik: translateY polos + fade
		anime({
			targets: main,
			duration: TOTAL_DURATION,
			easing: "easeInOutSine",
			translateY: "0vh",
			opacity: [0.5, 1]
		});

		anime({
			targets: projects,
			duration: TOTAL_DURATION,
			easing: "easeInOutSine",
			translateY: "100vh",
			opacity: [1, 0],
			complete: function () {
				stage = 1;
				isAnimatingStage = false;
			}
		});
	}

	/* ---- scroll horizontal per kategori (dipasang langsung di tiap .projects-viewport) ---- */
	function handleGroupWheel(groupIndex, e) {
		var st = groupState[groupIndex];
		if (!st) return;

		var now = Date.now();
		var isNewGesture = now - st.lastWheelTime > GESTURE_GAP;
		st.lastWheelTime = now;

		if (isNewGesture) {
			// sesi scroll baru dimulai: catat apakah baris ini memang sudah
			// mentok di posisi awal SEBELUM sesi ini bergerak sama sekali
			st.gestureStartedAtEdge = st.offset <= 0;
		}

		var atStart = st.offset <= 0;

		if (e.deltaY < 0 && atStart) {
			if (isNewGesture && st.gestureStartedAtEdge) {
				// sesi scroll baru yang murni dimulai saat baris ini sudah
				// habis/mentok di kiri -> baru dianggap niat balik ke section 2
				backToMain();
			}
			// selama masih dalam sesi scroll yang sama, sisa momentum di
			// posisi mentok cukup diserap saja, tidak memicu apa pun
			return;
		}

		st.offset += e.deltaY;
		applyGroupOffset(groupIndex);
	}

	function attachViewportWheel(viewportEl, groupIndex) {
		viewportEl.addEventListener("wheel", function (e) {
			if (stage !== 2) return;
			e.preventDefault();
			e.stopPropagation();
			handleGroupWheel(groupIndex, e);
		}, { passive: false });
	}

	/* ---- listener level halaman: hanya untuk trigger section 1->2, dan
	 * area putih di luar baris project (mis. judul/gap) saat di section 3 ---- */
	function handlePageWheel(e) {
		if (stage === 1) {
			if (e.deltaY > 0) goToProjects();
			return;
		}
		if (stage === 2) {
			var overViewport = e.target.closest && e.target.closest(".projects-viewport");
			if (!overViewport) {
				e.preventDefault();
				if (e.deltaY < 0) backToMain();
			}
			// kalau di atas salah satu baris project, biarkan listener
			// khusus viewport itu yang menangani (attachViewportWheel)
		}
	}

	document.body.addEventListener("wheel", handlePageWheel, { passive: false });
	window.addEventListener("resize", applyAllGroupOffsets);

	/* ---- dukungan sentuh (mobile) ---- */
	if (window.isPhone) {
		var pStartX = 0, pStartY = 0, dragging = false, activeGroupIndex = -1;

		document.addEventListener("touchstart", function (t) {
			pStartX = t.touches[0].pageX;
			pStartY = t.touches[0].pageY;
			dragging = true;
			var el = t.target.closest && t.target.closest(".projects-viewport");
			activeGroupIndex = el ? parseInt(el.getAttribute("data-group-index"), 10) : -1;
		}, { passive: true });

		document.addEventListener("touchmove", function (t) {
			if (!dragging) return;
			if (stage === 2 && activeGroupIndex > -1) {
				var dx = pStartX - t.touches[0].pageX;
				pStartX = t.touches[0].pageX;
				groupState[activeGroupIndex].offset += dx * 2;
				applyGroupOffset(activeGroupIndex);
			}
		}, { passive: true });

		document.addEventListener("touchend", function (t) {
			dragging = false;
			if (stage === 1 && typeof getMoveDirection === "function") {
				var endX = t.changedTouches[0].pageX;
				var endY = t.changedTouches[0].pageY;
				if (getMoveDirection(pStartX, pStartY, endX, endY) === window.DIRECTIONS.UP) {
					goToProjects();
				}
			}
			activeGroupIndex = -1;
		}, { passive: true });
	}

	/* -------------------------------------------------------------------
	 * Stage baru boleh berpindah ke 1 HANYA setelah transisi section 1 -> 2
	 * benar-benar selesai secara visual (bukan begitu fungsinya dipanggil).
	 * loadMain.loaded di main.js di-set true secara instan saat dipanggil,
	 * jauh sebelum animasinya kelar, jadi tidak dipakai sebagai patokan
	 * langsung. Sebagai gantinya kita amati class "in" pada .card-inner
	 * (ditambahkan oleh loadMain setelah delay) lalu tunggu durasi fade-nya
	 * (1s, sesuai .fade{transition:all 1s} di CSS) supaya benar-benar tuntas
	 * sebelum scroll boleh lanjut ke section project.
	 * ------------------------------------------------------------------- */
	var cardInner = document.querySelector(".card-inner");
	var FADE_TRANSITION_BUFFER = 1000; // ms, samakan dengan durasi .fade

	function armMainStageWhenReady() {
		if (!cardInner) {
			// fallback kalau elemen tak ditemukan: jangan pernah macet di stage 0
			setTimeout(function () { stage = 1; }, 1800);
			return;
		}
		if (cardInner.classList.contains("in")) {
			setTimeout(function () { stage = 1; }, FADE_TRANSITION_BUFFER);
			return;
		}
		var observer = new MutationObserver(function () {
			if (cardInner.classList.contains("in")) {
				observer.disconnect();
				setTimeout(function () { stage = 1; }, FADE_TRANSITION_BUFFER);
			}
		});
		observer.observe(cardInner, { attributes: true, attributeFilter: ["class"] });
	}

	armMainStageWhenReady();

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", renderProjects);
	} else {
		renderProjects();
	}
})();