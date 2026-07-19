(function () {
	"use strict";

	/* =========================================================================
	 * KELOLA PROJECT DI SINI
	 * Cukup tambah / ubah / hapus item di array ini untuk mengelola daftar
	 * project yang tampil di section baru (tidak perlu sentuh HTML/CSS).
	 *
	 * name  : nama project yang ditampilkan
	 * desc  : deskripsi singkat (opsional)
	 * path  : path folder project, contoh "projects/project-3/index.html"
	 * ========================================================================= */
	window.projectsData = [
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
	];
	/* ========================================================================= */

	function renderProjects() {
		var track = document.getElementById("projectsTrack");
		if (!track) return;
		track.innerHTML = "";
		window.projectsData.forEach(function (p, i) {
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
	}

	/* ---- state: 0 = intro, 1 = main (card), 2 = projects ---- */
	var stage = 0;
	var trackOffset = 0;
	var isAnimatingStage = false;

	function getTrack() {
		return document.getElementById("projectsTrack");
	}

	function maxTrackOffset() {
		var track = getTrack();
		var wrap = document.querySelector(".projects-viewport");
		if (!track || !wrap) return 0;
		return Math.max(0, track.scrollWidth - wrap.clientWidth);
	}

	function applyTrackOffset() {
		var track = getTrack();
		if (!track) return;
		var max = maxTrackOffset();
		trackOffset = Math.min(Math.max(trackOffset, 0), max);
		track.style.transform = "translateX(-" + trackOffset + "px)";
	}

	function goToProjects() {
		if (isAnimatingStage || stage !== 1 || typeof anime === "undefined") return;
		isAnimatingStage = true;
		var main = document.querySelector(".content-main");
		var projects = document.querySelector(".content-projects");
		var TOTAL_DURATION = 1100; // samakan dengan durasi transisi section 1 -> 2

		// arah "muncul" dari atas, seperti svg.shape pada transisi intro -> main
		projects.style.transformOrigin = "50% 0%";
		main.style.transformOrigin = "50% 100%";

		// panel lama (hitam): geser ke atas sambil memudar,
		// supaya tidak "cut" tiba-tiba ke putih
		anime({
			targets: main,
			duration: TOTAL_DURATION,
			easing: "easeInOutSine",
			translateY: "-100vh",
			opacity: [1, 0.5]
		});

		// panel baru (putih): geser masuk + squash-stretch elastis + fade in,
		// meniru efek scaleY pada svg.shape saat transisi intro -> main
		anime({
			targets: projects,
			duration: TOTAL_DURATION,
			easing: "easeInOutSine",
			translateY: ["100vh", "0vh"],
			opacity: [0, 1],
			scaleY: [
				{ value: [0.82, 1.18], duration: TOTAL_DURATION / 2, easing: "easeInQuad" },
				{ value: 1, duration: TOTAL_DURATION / 2, easing: "easeOutQuad" }
			],
			complete: function () {
				stage = 2;
				gestureStartedAtEdge = false;
				lastWheelTime = 0;
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

		main.style.transformOrigin = "50% 0%";
		projects.style.transformOrigin = "50% 100%";

		// panel hitam kembali muncul dari atas dengan efek elastis + fade in
		anime({
			targets: main,
			duration: TOTAL_DURATION,
			easing: "easeInOutSine",
			translateY: "0vh",
			opacity: [0.5, 1],
			scaleY: [
				{ value: [0.82, 1.18], duration: TOTAL_DURATION / 2, easing: "easeInQuad" },
				{ value: 1, duration: TOTAL_DURATION / 2, easing: "easeOutQuad" }
			]
		});

		// panel putih turun keluar sambil memudar
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

	var GESTURE_GAP = 260; // ms jeda dianggap sesi scroll baru
	var lastWheelTime = 0;
	var gestureStartedAtEdge = false;

	function handleWheel(e) {
		if (stage === 1) {
			if (e.deltaY > 0) goToProjects();
			return;
		}
		if (stage === 2) {
			e.preventDefault();

			var now = Date.now();
			var isNewGesture = now - lastWheelTime > GESTURE_GAP;
			lastWheelTime = now;

			if (isNewGesture) {
				// sesi scroll baru dimulai: catat apakah list memang sudah
				// mentok di posisi awal SEBELUM sesi ini bergerak sama sekali
				gestureStartedAtEdge = trackOffset <= 0;
			}

			var atStart = trackOffset <= 0;

			if (e.deltaY < 0 && atStart) {
				if (isNewGesture && gestureStartedAtEdge) {
					// ini sesi scroll baru yang murni dimulai saat list sudah
					// habis/mentok di kiri -> baru dianggap niat balik ke section 2
					backToMain();
				}
				// selama masih dalam sesi scroll yang sama, sisa momentum di
				// posisi mentok cukup diserap saja, tidak memicu apa pun
				return;
			}

			// selama di dalam section project: scroll hanya menggerakkan list
			// secara horizontal, halaman tidak ikut scroll vertikal
			trackOffset += e.deltaY;
			applyTrackOffset();
		}
	}

	document.body.addEventListener("wheel", handleWheel, { passive: false });
	window.addEventListener("resize", applyTrackOffset);

	/* ---- dukungan sentuh (mobile) ---- */
	if (window.isPhone) {
		var pStartX = 0, pStartY = 0, dragging = false;

		document.addEventListener("touchstart", function (t) {
			pStartX = t.touches[0].pageX;
			pStartY = t.touches[0].pageY;
			dragging = true;
		}, { passive: true });

		document.addEventListener("touchmove", function (t) {
			if (!dragging) return;
			if (stage === 2) {
				var dx = pStartX - t.touches[0].pageX;
				pStartX = t.touches[0].pageX;
				trackOffset += dx * 2;
				applyTrackOffset();
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