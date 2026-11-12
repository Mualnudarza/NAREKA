/* =========================================================
   Logika Interaktif Kualitas Operasional (Slide 8 - 15)
   Navigasi Slide, Simulator Kanvas Cp/Cpk, Live Radar SPC & Andon,
   Kalkulator Neraca Biaya PAF, serta Tab 7 QC Tools
   ========================================================= */

(function () {
  "use strict";

  // =========================================================
  // 1. MANAJEMEN STATE NAVIGASI SLIDE
  // =========================================================
  const SLIDE_MIN = 8;
  const SLIDE_MAX = 15;
  let currentSlide = SLIDE_MIN;

  const stepIndicator = document.getElementById("step-indicator");
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const jumpButtons = document.querySelectorAll(".jump-btn");
  const slideCards = document.querySelectorAll(".slide-card");

  function updateSlide(slideNum) {
    if (slideNum < SLIDE_MIN) slideNum = SLIDE_MIN;
    if (slideNum > SLIDE_MAX) slideNum = SLIDE_MAX;
    currentSlide = slideNum;

    slideCards.forEach((card) => {
      const num = parseInt(card.dataset.slide, 10);
      if (num === currentSlide) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });

    jumpButtons.forEach((btn) => {
      const num = parseInt(btn.dataset.target, 10);
      if (num === currentSlide) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    if (stepIndicator) {
      stepIndicator.textContent = `Slide ${currentSlide} / ${SLIDE_MAX}`;
    }
    if (btnPrev) btnPrev.disabled = currentSlide === SLIDE_MIN;
    if (btnNext) btnNext.disabled = currentSlide === SLIDE_MAX;

    // Picu ulang rendering kanvas saat slide bersangkutan aktif
    if (currentSlide === 11) {
      setTimeout(renderPAFCanvas, 50);
    } else if (currentSlide === 13) {
      setTimeout(drawSPCCanvas, 50);
    } else if (currentSlide === 14) {
      setTimeout(renderCapabilityCanvas, 50);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (btnPrev) {
    btnPrev.addEventListener("click", () => updateSlide(currentSlide - 1));
  }
  if (btnNext) {
    btnNext.addEventListener("click", () => updateSlide(currentSlide + 1));
  }

  jumpButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = parseInt(btn.dataset.target, 10);
      updateSlide(target);
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "ArrowLeft") {
      updateSlide(currentSlide - 1);
    } else if (e.key === "ArrowRight") {
      updateSlide(currentSlide + 1);
    }
  });


  // =========================================================
  // 2. SIMULATOR KANVAS KURVA NERACA BIAYA MUTU PAF (SLIDE 11)
  // =========================================================
  const pafCanvas = document.getElementById("paf-canvas");
  const sliderPrev = document.getElementById("slider-prev");
  const dispPrev = document.getElementById("disp-prev");
  const dispAppr = document.getElementById("disp-appr");
  const dispFailInt = document.getElementById("disp-fail-int");
  const dispFailExt = document.getElementById("disp-fail-ext");
  const dispTotal = document.getElementById("disp-total");
  const pafSummary = document.getElementById("paf-summary");

  const btnPreDisaster = document.getElementById("paf-pre-disaster");
  const btnPreOptimal = document.getElementById("paf-pre-optimal");
  const btnPreOver = document.getElementById("paf-pre-over");

  function calculatePAF() {
    if (!sliderPrev) return;
    const prev = parseInt(sliderPrev.value, 10); // Rp 2 - 25 Juta

    const appr = Math.max(8, Math.round(30 - (prev * 0.8)));
    const failInt = Math.max(5, Math.round(90 / (prev * 0.45)));
    const failExt = Math.max(2, Math.round(240 / Math.pow(prev, 1.25)));
    const total = prev + appr + failInt + failExt;

    if (dispPrev) dispPrev.textContent = "Rp " + prev + " Juta";
    if (dispAppr) dispAppr.textContent = "Rp " + appr + " Juta";
    if (dispFailInt) dispFailInt.textContent = "Rp " + failInt + " Juta";
    if (dispFailExt) dispFailExt.textContent = "Rp " + failExt + " Juta";
    if (dispTotal) dispTotal.textContent = "Rp " + total + " Juta";

    if (pafSummary) {
      if (prev >= 11 && prev <= 15) {
        pafSummary.textContent = "Titik Optimum Tercapai: Total biaya operasional berada di titik paling rendah (parabola minimum)!";
      } else if (prev < 6) {
        pafSummary.textContent = "Bahaya Pelit Pencegahan: Penghematan semu di awal memicu ledakan biaya kegagalan eksternal ratusan juta!";
      } else if (prev > 18) {
        pafSummary.textContent = "Pencegahan Berlebih: Biaya kesesuaian mulai membengkak melampaui manfaat penghematan kegagalan.";
      } else {
        pafSummary.textContent = "Zona Transisi: Investasi pencegahan mulai menurunkan biaya kegagalan secara konsisten.";
      }
    }

    renderPAFCanvas();
  }

  function renderPAFCanvas() {
    if (!pafCanvas) return;
    const ctx = pafCanvas.getContext("2d");
    const W = pafCanvas.width;
    const H = pafCanvas.height;

    ctx.clearRect(0, 0, W, H);

    // Padding area grafik
    const padL = 70;
    const padR = 40;
    const padT = 30;
    const padB = 40;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    // Sumbu X: Biaya Pencegahan (2 s/d 25)
    // Sumbu Y: Biaya Rupiah (0 s/d 180)
    const yMax = 160;

    function toX(val) {
      return padL + ((val - 2) / (25 - 2)) * plotW;
    }
    function toY(cost) {
      const clamped = Math.max(0, Math.min(yMax, cost));
      return padT + plotH - (clamped / yMax) * plotH;
    }

    // Grid halus
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    for (let c = 40; c <= yMax; c += 40) {
      const y = toY(c);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.stroke();

      ctx.fillStyle = "#64748b";
      ctx.font = "10px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("Rp " + c + " Jt", padL - 8, y + 3);
    }

    // Garis Sumbu Utama
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(W - padR, padT + plotH);
    ctx.stroke();

    // Label Sumbu
    ctx.fillStyle = "#000000";
    ctx.font = "700 11px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Tingkat Investasi Pencegahan (Rp Juta) &rarr;", padL + plotW / 2, H - 10);

    // 1. Kurva Biaya Kesesuaian (Pencegahan + Penilaian) -> Naik ke kanan
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let p = 2; p <= 25; p += 0.5) {
      const ap = Math.max(8, 30 - p * 0.8);
      const conf = p + ap;
      const x = toX(p);
      const y = toY(conf);
      if (p === 2) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 2. Kurva Biaya Kegagalan (Internal + Eksternal) -> Turun drastis
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let p = 2; p <= 25; p += 0.5) {
      const fi = Math.max(5, 90 / (p * 0.45));
      const fe = Math.max(2, 240 / Math.pow(p, 1.25));
      const fail = fi + fe;
      const x = toX(p);
      const y = toY(fail);
      if (p === 2) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 3. Kurva Total Biaya Mutu (Parabola Mangkuk)
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    for (let p = 2; p <= 25; p += 0.5) {
      const ap = Math.max(8, 30 - p * 0.8);
      const fi = Math.max(5, 90 / (p * 0.45));
      const fe = Math.max(2, 240 / Math.pow(p, 1.25));
      const tot = p + ap + fi + fe;
      const x = toX(p);
      const y = toY(tot);
      if (p === 2) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Legenda Kurva di Sudut Kanan Atas
    ctx.font = "700 11px Inter, sans-serif";
    ctx.textAlign = "left";

    ctx.fillStyle = "#dc2626";
    ctx.fillRect(W - 220, 14, 12, 12);
    ctx.strokeRect(W - 220, 14, 12, 12);
    ctx.fillText("Biaya Kegagalan (Scrap/Recall)", W - 202, 24);

    ctx.fillStyle = "#2563eb";
    ctx.fillRect(W - 220, 32, 12, 12);
    ctx.strokeRect(W - 220, 32, 12, 12);
    ctx.fillText("Biaya Kesesuaian (Pencegahan)", W - 202, 42);

    ctx.fillStyle = "#000000";
    ctx.fillRect(W - 220, 50, 12, 12);
    ctx.strokeRect(W - 220, 50, 12, 12);
    ctx.fillText("TOTAL BIAYA KUALITAS", W - 202, 60);

    // Titik Operasi Saat Ini (Active Operational Point)
    const curP = parseInt(sliderPrev ? sliderPrev.value : 12, 10);
    const curAp = Math.max(8, 30 - curP * 0.8);
    const curFi = Math.max(5, 90 / (curP * 0.45));
    const curFe = Math.max(2, 240 / Math.pow(curP, 1.25));
    const curTot = curP + curAp + curFi + curFe;

    const curX = toX(curP);
    const curY = toY(curTot);

    // Garis putus-putus ke titik aktif
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(curX, padT + plotH);
    ctx.lineTo(curX, curY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Titik Emas Aktif
    ctx.fillStyle = "#ffd966";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(curX, curY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Label Balon di atas titik
    ctx.fillStyle = "#000000";
    ctx.font = "700 12px Balsamiq Sans, Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Posisi Pabrik: Rp " + curTot + " Jt", curX, curY - 12);
  }

  function setPAFPreset(val) {
    if (!sliderPrev) return;
    sliderPrev.value = val;
    calculatePAF();

    [btnPreDisaster, btnPreOptimal, btnPreOver].forEach((b) => {
      if (b) {
        if (parseInt(b.dataset.val, 10) === val) b.classList.add("active");
        else b.classList.remove("active");
      }
    });
  }

  if (sliderPrev) sliderPrev.addEventListener("input", calculatePAF);
  if (btnPreDisaster) btnPreDisaster.addEventListener("click", () => setPAFPreset(2));
  if (btnPreOptimal) btnPreOptimal.addEventListener("click", () => setPAFPreset(12));
  if (btnPreOver) btnPreOver.addEventListener("click", () => setPAFPreset(22));


  // =========================================================
  // 3. RADAR LIVE SPC & SIMULATOR ALARM ANDON (SLIDE 13 & 9)
  // =========================================================
  const spcCanvas = document.getElementById("spc-canvas");
  const andonRed = document.getElementById("andon-red");
  const andonYellow = document.getElementById("andon-yellow");
  const andonGreen = document.getElementById("andon-green");
  const andonStatusText = document.getElementById("andon-status-text");
  const spcLiveExplainer = document.getElementById("spc-live-explainer");

  const btnSpcToggle = document.getElementById("spc-btn-toggle");
  const btnSpcNormal = document.getElementById("spc-btn-normal");
  const btnSpcDrift = document.getElementById("spc-btn-drift");
  const btnSpcShock = document.getElementById("spc-btn-shock");
  const btnSpcReset = document.getElementById("spc-btn-reset");

  // State SPC
  let spcPoints = [];
  let spcTimer = null;
  let isSpcStreaming = true;
  let spcScenario = "normal"; // 'normal', 'drift', 'shock'
  let driftStep = 0;

  const UCL_VAL = 306.0;
  const CL_VAL = 300.0;
  const LCL_VAL = 294.0;
  const MAX_POINTS = 22;

  function initSPCPoints() {
    spcPoints = [];
    driftStep = 0;
    for (let i = 0; i < 8; i++) {
      const val = CL_VAL + (Math.random() - 0.5) * 4.2;
      spcPoints.push(parseFloat(val.toFixed(2)));
    }
    updateAndonState();
    drawSPCCanvas();
  }

  function addSPCPoint() {
    let nextVal = CL_VAL;

    if (spcScenario === "normal") {
      nextVal = CL_VAL + (Math.random() - 0.5) * 4.4;
    } else if (spcScenario === "drift") {
      driftStep += 0.9;
      nextVal = CL_VAL + (Math.random() - 0.3) * 2 + driftStep;
      if (nextVal > 308) {
        // Puncak keausan
        nextVal = 307.8 + Math.random();
      }
    } else if (spcScenario === "shock") {
      // Lonjakan bencana mendadak
      nextVal = 309.2 + Math.random() * 1.5;
    }

    spcPoints.push(parseFloat(nextVal.toFixed(2)));
    if (spcPoints.length > MAX_POINTS) {
      spcPoints.shift();
    }

    updateAndonState();
    drawSPCCanvas();
  }

  function updateAndonState() {
    if (!spcPoints.length) return;
    const latest = spcPoints[spcPoints.length - 1];

    let hasOutlier = spcPoints.some((p) => p >= UCL_VAL || p <= LCL_VAL);
    let isTrending = false;

    // Periksa apakah ada 5 titik berurutan di atas 302.5
    if (spcPoints.length >= 5) {
      const last5 = spcPoints.slice(-5);
      if (last5.every((p) => p > 301.8)) isTrending = true;
    }

    if (hasOutlier) {
      // Status Merah: Stop Lini Jidoka
      setAndonBulb("red");
      if (andonStatusText) {
        andonStatusText.textContent = "STOP LINI! JIDOKA DIAKTIFKAN - TITIK MELOMPAT KELUAR BATAS!";
        andonStatusText.style.color = "#f87171";
      }
      if (spcLiveExplainer) {
        spcLiveExplainer.textContent = "Alarm Andon Berbunyi: Titik menembus garis merah UCL! Operator menarik tuas darurat, konveyor pabrik berhenti seketika sebelum ribuan produk rusak menumpuk.";
        spcLiveExplainer.style.background = "#fee2e2";
        spcLiveExplainer.style.color = "#991b1b";
      }
    } else if (isTrending) {
      // Status Kuning: Waspada Pahat Aus
      setAndonBulb("yellow");
      if (andonStatusText) {
        andonStatusText.textContent = "PERINGATAN: TREN KEAUSAN PAHAT / PERGESERAN PROSES TERDETEKSI";
        andonStatusText.style.color = "#fde047";
      }
      if (spcLiveExplainer) {
        spcLiveExplainer.textContent = "Peringatan Waspada: Titik-titik mulai merangkak naik konsisten mendekati batas atas. Pahat mesin mulai aus dan perlu dijadwalkan pergantian sebelum melanggar UCL!";
        spcLiveExplainer.style.background = "#fef3c7";
        spcLiveExplainer.style.color = "#92400e";
      }
    } else {
      // Status Hijau: Normal Alami
      setAndonBulb("green");
      if (andonStatusText) {
        andonStatusText.textContent = "STATUS: PROSES STABIL (VARIASI ALAMI TERKENDALI)";
        andonStatusText.style.color = "#4ade80";
      }
      if (spcLiveExplainer) {
        spcLiveExplainer.textContent = "Aturan Emas: Titik-titik bergelombang wajar di sekitar garis tengah itu normal. Jangan pernah mengotak-atik mesin jika titik masih di dalam batas UCL dan LCL!";
        spcLiveExplainer.style.background = "var(--c-eva-bg)";
        spcLiveExplainer.style.color = "var(--c-eva-ink)";
      }
    }
  }

  function setAndonBulb(activeColor) {
    if (andonRed) andonRed.classList.toggle("active", activeColor === "red");
    if (andonYellow) andonYellow.classList.toggle("active", activeColor === "yellow");
    if (andonGreen) andonGreen.classList.toggle("active", activeColor === "green");
  }

  function drawSPCCanvas() {
    if (!spcCanvas) return;
    const ctx = spcCanvas.getContext("2d");
    const W = spcCanvas.width;
    const H = spcCanvas.height;

    ctx.clearRect(0, 0, W, H);

    const padL = 75;
    const padR = 120;
    const padT = 30;
    const padB = 30;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    const minScale = 290.0;
    const maxScale = 312.0;

    function toY(val) {
      return padT + plotH - ((val - minScale) / (maxScale - minScale)) * plotH;
    }

    // 1. Zona Aman Latar Belakang (Hijau Transparan di antara UCL dan LCL)
    const yUCL = toY(UCL_VAL);
    const yLCL = toY(LCL_VAL);
    const yCL = toY(CL_VAL);

    ctx.fillStyle = "rgba(134, 239, 172, 0.18)";
    ctx.fillRect(padL, yUCL, plotW, yLCL - yUCL);

    // 2. Garis Batas UCL (+3 Sigma)
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(padL, yUCL);
    ctx.lineTo(padL + plotW, yUCL);
    ctx.stroke();

    // 3. Garis Tengah CL (Mean Target)
    ctx.setLineDash([]);
    ctx.strokeStyle = "#16a34a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padL, yCL);
    ctx.lineTo(padL + plotW, yCL);
    ctx.stroke();

    // 4. Garis Batas LCL (-3 Sigma)
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(padL, yLCL);
    ctx.lineTo(padL + plotW, yLCL);
    ctx.stroke();
    ctx.setLineDash([]);

    // Label Batas di Kanan
    ctx.font = "700 11px Balsamiq Sans, Inter, sans-serif";
    ctx.textAlign = "left";

    ctx.fillStyle = "#dc2626";
    ctx.fillText("UCL = 306.0 (+3σ)", padL + plotW + 10, yUCL + 4);

    ctx.fillStyle = "#15803d";
    ctx.fillText("CL = 300.0 (Target)", padL + plotW + 10, yCL + 4);

    ctx.fillStyle = "#dc2626";
    ctx.fillText("LCL = 294.0 (-3σ)", padL + plotW + 10, yLCL + 4);

    // Label Sumbu Y
    ctx.fillStyle = "#64748b";
    ctx.font = "10px Inter, sans-serif";
    ctx.textAlign = "right";
    [292, 296, 300, 304, 308].forEach((v) => {
      ctx.fillText(v + " µm", padL - 8, toY(v) + 3);
    });

    // 5. Garis dan Titik Data Sampel yang Sedang Mengalir
    if (spcPoints.length > 0) {
      const stepX = plotW / (MAX_POINTS - 1);

      // Garis Penghubung
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < spcPoints.length; i++) {
        const x = padL + i * stepX;
        const y = toY(spcPoints[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Lingkaran Titik
      for (let i = 0; i < spcPoints.length; i++) {
        const x = padL + i * stepX;
        const val = spcPoints[i];
        const y = toY(val);
        const isOut = val >= UCL_VAL || val <= LCL_VAL;

        ctx.beginPath();
        ctx.arc(x, y, isOut ? 6.5 : 4.5, 0, Math.PI * 2);

        if (isOut) {
          ctx.fillStyle = "#ef4444";
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 2;
        } else {
          ctx.fillStyle = (i === spcPoints.length - 1) ? "#3b82f6" : "#ffffff";
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 2;
        }
        ctx.fill();
        ctx.stroke();

        // Label angka pada titik terakhir
        if (i === spcPoints.length - 1) {
          ctx.fillStyle = isOut ? "#dc2626" : "#1d4ed8";
          ctx.font = "700 11px Inter, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(val.toFixed(1), x, y - 10);
        }
      }
    }
  }

  function toggleSPCStream() {
    isSpcStreaming = !isSpcStreaming;
    if (btnSpcToggle) {
      btnSpcToggle.textContent = isSpcStreaming ? "Jeda Detak Mesin" : "Lanjutkan Detak Mesin";
      btnSpcToggle.classList.toggle("active", isSpcStreaming);
    }
    if (isSpcStreaming) {
      startSPCTimer();
    } else {
      stopSPCTimer();
    }
  }

  function startSPCTimer() {
    stopSPCTimer();
    spcTimer = setInterval(() => {
      addSPCPoint();
    }, 900);
  }

  function stopSPCTimer() {
    if (spcTimer) {
      clearInterval(spcTimer);
      spcTimer = null;
    }
  }

  function setSPCScenario(scen) {
    spcScenario = scen;
    driftStep = 0;

    [btnSpcNormal, btnSpcDrift, btnSpcShock].forEach((b) => {
      if (b) b.classList.remove("active");
    });

    if (scen === "normal" && btnSpcNormal) btnSpcNormal.classList.add("active");
    if (scen === "drift" && btnSpcDrift) btnSpcDrift.classList.add("active");
    if (scen === "shock" && btnSpcShock) btnSpcShock.classList.add("active");

    if (!isSpcStreaming) {
      toggleSPCStream();
    }
  }

  if (btnSpcToggle) btnSpcToggle.addEventListener("click", toggleSPCStream);
  if (btnSpcNormal) btnSpcNormal.addEventListener("click", () => setSPCScenario("normal"));
  if (btnSpcDrift) btnSpcDrift.addEventListener("click", () => setSPCScenario("drift"));
  if (btnSpcShock) btnSpcShock.addEventListener("click", () => setSPCScenario("shock"));
  if (btnSpcReset) btnSpcReset.addEventListener("click", () => {
    spcScenario = "normal";
    setSPCScenario("normal");
    initSPCPoints();
  });


  // =========================================================
  // 4. SIMULATOR KANVAS KURVA LONCENG GAUSSIAN (SLIDE 14)
  // =========================================================
  const capabilityCanvas = document.getElementById("capability-canvas");
  const simMu = document.getElementById("sim-mu");
  const simSigma = document.getElementById("sim-sigma");
  const simTol = document.getElementById("sim-tol");

  const valMu = document.getElementById("val-mu");
  const valSigma = document.getElementById("val-sigma");
  const valTol = document.getElementById("val-tol");

  const resCp = document.getElementById("res-cp");
  const resCpk = document.getElementById("res-cpk");
  const badgeCp = document.getElementById("badge-cp");
  const badgeCpk = document.getElementById("badge-cpk");
  const garageStatus = document.getElementById("garage-status");

  const btnCapIdeal = document.getElementById("cap-pre-ideal");
  const btnCapTrap = document.getElementById("cap-pre-trap");
  const btnCapBroken = document.getElementById("cap-pre-broken");

  function calculateCapability() {
    if (!simMu || !simSigma || !simTol) return;

    const mu = parseFloat(simMu.value);
    const sigma = parseFloat(simSigma.value);
    const tolHalf = parseFloat(simTol.value);
    const target = 300;
    const usl = target + tolHalf;
    const lsl = target - tolHalf;

    if (valMu) valMu.textContent = mu.toFixed(1) + " µm";
    if (valSigma) valSigma.textContent = sigma.toFixed(2) + " µm";
    if (valTol) valTol.textContent = "±" + tolHalf.toFixed(0) + " µm";

    const cp = (usl - lsl) / (6 * sigma);
    const cpu = (usl - mu) / (3 * sigma);
    const cpl = (mu - lsl) / (3 * sigma);
    const cpk = Math.min(cpu, cpl);

    if (resCp) resCp.textContent = cp.toFixed(2);
    if (resCpk) resCpk.textContent = cpk.toFixed(2);

    // Status Garasi Cp
    if (badgeCp) {
      if (cp >= 1.33) {
        badgeCp.className = "status-pill status-good";
        badgeCp.textContent = "Lebar Garasi Memadai (Cp ≥ 1.33)";
      } else if (cp >= 1.0) {
        badgeCp.className = "status-pill status-warn";
        badgeCp.textContent = "Garasi Pas-Pasan (Cp 1.0 - 1.3)";
      } else {
        badgeCp.className = "status-pill status-bad";
        badgeCp.textContent = "Garasi Terlalu Sempit (Cp < 1.0)";
      }
    }

    // Status Sopir Cpk
    if (badgeCpk) {
      if (cpk >= 1.33) {
        badgeCpk.className = "status-pill status-good";
        badgeCpk.textContent = "Parkir Tengah & Aman (Cpk ≥ 1.33)";
      } else if (cpk >= 1.0) {
        badgeCpk.className = "status-pill status-warn";
        badgeCpk.textContent = "Mepet Dinding (Rawan Cacat)";
      } else {
        badgeCpk.className = "status-pill status-bad";
        badgeCpk.textContent = "Menabrak Dinding (Cacat Massal!)";
      }
    }

    if (garageStatus) {
      if (cpk >= 1.33) {
        garageStatus.textContent = "Analogi Nyata: Garasi cukup lebar dan mobil diparkir tepat di tengah. Spion aman sentosa!";
      } else if (cp >= 1.33 && cpk < 1.0) {
        garageStatus.textContent = "Analogi Nyata: Garasi sebenarnya sangat lebar (Cp tinggi), tapi sopirnya parkir miring ke kanan sampai spion patah (Cpk hancur)! Inilah jebakan maut!";
      } else {
        garageStatus.textContent = "Analogi Nyata: Mobil terlalu gemuk atau jalan terlalu sempit (variasi melebar). Barang cacat meluncur deras keluar pabrik.";
      }
    }

    renderCapabilityCanvas();
  }

  function renderCapabilityCanvas() {
    if (!capabilityCanvas) return;
    const ctx = capabilityCanvas.getContext("2d");
    const W = capabilityCanvas.width;
    const H = capabilityCanvas.height;

    ctx.clearRect(0, 0, W, H);

    const padL = 70;
    const padR = 70;
    const padT = 40;
    const padB = 40;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    const mu = parseFloat(simMu ? simMu.value : 300);
    const sigma = parseFloat(simSigma ? simSigma.value : 1.5);
    const tolHalf = parseFloat(simTol ? simTol.value : 10);
    const target = 300;
    const lsl = target - tolHalf;
    const usl = target + tolHalf;

    // Rentang visual X: 280 µm s/d 320 µm
    const minX = 280;
    const maxX = 320;

    function toPixelX(xVal) {
      return padL + ((xVal - minX) / (maxX - minX)) * plotW;
    }

    // Fungsi Kepadatan Probabilitas Normal (Gaussian)
    function gaussian(x, m, s) {
      const a = 1 / (s * Math.sqrt(2 * Math.PI));
      const exp = Math.exp(-Math.pow(x - m, 2) / (2 * Math.pow(s, 2)));
      return a * exp;
    }

    // Skala vertikal: Puncak kurva standar (sigma = 1.0) memetakan ke 80% tinggi kanvas
    const peakStd = 1 / (0.8 * Math.sqrt(2 * Math.PI));
    function toPixelY(prob) {
      const scaled = (prob / peakStd) * (plotH * 1.5);
      return padT + plotH - Math.min(plotH - 10, scaled);
    }

    const baselineY = padT + plotH;
    const pxLSL = toPixelX(lsl);
    const pxUSL = toPixelX(usl);
    const pxTarget = toPixelX(target);
    const pxMu = toPixelX(mu);

    // Langkah diskrit rendering kurva
    const steps = 180;
    const curvePoints = [];
    for (let i = 0; i <= steps; i++) {
      const xVal = minX + (i / steps) * (maxX - minX);
      const prob = gaussian(xVal, mu, sigma);
      curvePoints.push({ x: toPixelX(xVal), y: toPixelY(prob), val: xVal });
    }

    // 1. Gambar Area di Bawah Kurva
    // Potong menjadi 3 segmen: Kiri LSL (Cacat), Tengah (Aman), Kanan USL (Cacat)

    // A. Area Aman (Hijau di antara LSL dan USL)
    ctx.fillStyle = "rgba(134, 239, 172, 0.55)";
    ctx.beginPath();
    ctx.moveTo(pxLSL, baselineY);
    curvePoints.forEach((pt) => {
      if (pt.val >= lsl && pt.val <= usl) {
        ctx.lineTo(pt.x, pt.y);
      }
    });
    ctx.lineTo(pxUSL, baselineY);
    ctx.closePath();
    ctx.fill();

    // B. Area Cacat Bawah (Merah < LSL)
    if (mu - 3.5 * sigma < lsl) {
      ctx.fillStyle = "rgba(239, 68, 68, 0.7)";
      ctx.beginPath();
      ctx.moveTo(toPixelX(minX), baselineY);
      curvePoints.forEach((pt) => {
        if (pt.val <= lsl) {
          ctx.lineTo(pt.x, pt.y);
        }
      });
      ctx.lineTo(pxLSL, baselineY);
      ctx.closePath();
      ctx.fill();
    }

    // C. Area Cacat Atas (Merah > USL)
    if (mu + 3.5 * sigma > usl) {
      ctx.fillStyle = "rgba(239, 68, 68, 0.7)";
      ctx.beginPath();
      ctx.moveTo(pxUSL, baselineY);
      curvePoints.forEach((pt) => {
        if (pt.val >= usl) {
          ctx.lineTo(pt.x, pt.y);
        }
      });
      ctx.lineTo(toPixelX(maxX), baselineY);
      ctx.closePath();
      ctx.fill();
    }

    // 2. Garis Kontur Kurva Lonceng (Tebal & Bersih)
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.beginPath();
    curvePoints.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();

    // 3. Garis Dinding Toleransi Merah (LSL & USL)
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 3;

    // Garis LSL
    ctx.beginPath();
    ctx.moveTo(pxLSL, padT - 10);
    ctx.lineTo(pxLSL, baselineY);
    ctx.stroke();

    // Garis USL
    ctx.beginPath();
    ctx.moveTo(pxUSL, padT - 10);
    ctx.lineTo(pxUSL, baselineY);
    ctx.stroke();

    // 4. Garis Target Nominal Tengah (Hitam Putus-putus)
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pxTarget, padT);
    ctx.lineTo(pxTarget, baselineY);
    ctx.stroke();

    // 5. Garis Rata-Rata Aktual Mesin (Biru)
    ctx.setLineDash([5, 3]);
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pxMu, padT);
    ctx.lineTo(pxMu, baselineY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Garis Sumbu X
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padL - 10, baselineY);
    ctx.lineTo(W - padR + 10, baselineY);
    ctx.stroke();

    // Label Penjelas Teks
    ctx.font = "700 11px Balsamiq Sans, Inter, sans-serif";

    // Label LSL
    ctx.fillStyle = "#dc2626";
    ctx.textAlign = "center";
    ctx.fillText("LSL: " + lsl.toFixed(0) + " µm", pxLSL, padT - 16);

    // Label USL
    ctx.fillText("USL: " + usl.toFixed(0) + " µm", pxUSL, padT - 16);

    // Label Target
    ctx.fillStyle = "#475569";
    ctx.fillText("Target: 300 µm", pxTarget, baselineY + 16);

    // Label Mean Aktual
    ctx.fillStyle = "#1d4ed8";
    ctx.fillText("Rata-Rata: " + mu.toFixed(1) + " µm", pxMu, padT - 4);

    // Spanduk Cacat jika menembus dinding
    if (mu + 3 * sigma > usl) {
      ctx.fillStyle = "#b91c1c";
      ctx.font = "700 12px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("DAERAH CACAT (SCRAP)!", pxUSL + 8, padT + 40);
    }
    if (mu - 3 * sigma < lsl) {
      ctx.fillStyle = "#b91c1c";
      ctx.font = "700 12px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("DAERAH CACAT (SCRAP)!", pxLSL - 8, padT + 40);
    }
  }

  function setCapabilityPreset(targetMu, targetSigma, targetTol) {
    if (simMu) simMu.value = targetMu;
    if (simSigma) simSigma.value = targetSigma;
    if (simTol) simTol.value = targetTol;

    [btnCapIdeal, btnCapTrap, btnCapBroken].forEach((b) => {
      if (b) b.classList.remove("active");
    });

    calculateCapability();
  }

  if (simMu) simMu.addEventListener("input", calculateCapability);
  if (simSigma) simSigma.addEventListener("input", calculateCapability);
  if (simTol) simTol.addEventListener("input", calculateCapability);

  if (btnCapIdeal) btnCapIdeal.addEventListener("click", () => {
    btnCapIdeal.classList.add("active");
    setCapabilityPreset(300, 1.5, 10);
  });
  if (btnCapTrap) btnCapTrap.addEventListener("click", () => {
    btnCapTrap.classList.add("active");
    setCapabilityPreset(306, 1.5, 10);
  });
  if (btnCapBroken) btnCapBroken.addEventListener("click", () => {
    btnCapBroken.classList.add("active");
    setCapabilityPreset(300, 3.5, 10);
  });


  // =========================================================
  // 5. TAB 7 ALAT PENGENDALI KUALITAS (SLIDE 12)
  // =========================================================
  const qcToolsData = {
    1: {
      name: "Check Sheet (Lembar Periksa)",
      tag: "Akuisisi Data",
      colorTag: "tag-doc",
      superpower: "Formulir turus untuk mengumpulkan fakta kejadian secara objektif tanpa bias ingatan.",
      adhdSummary: "Cukup centang atau bikin garis turus tiap kali ada barang aneh. Jangan mengandalkan ingatan kepala manusia.",
      whenToUse: "Hari pertama investigasi ketika kamu belum punya data angka pasti di lantai kerja.",
      asciiVisual: "+-----------+-------+\n| Jenis Cacat| Turus |\n+-----------+-------+\n| Goresan   | ||||  |\n| Patah     | ||    |\n| Melengkung| ||||| |\n+-----------+-------+"
    },
    2: {
      name: "Histogram",
      tag: "Sebaran Frekuensi",
      colorTag: "tag-mat",
      superpower: "Grafik batang sebaran ukuran data untuk melihat apakah proses berbentuk lonceng normal atau miring.",
      adhdSummary: "Melihat bentuk tubuh data: apakah gemuk di tengah (normal), miring ke kiri/kanan, atau punya dua puncak kembar.",
      whenToUse: "Saat mengukur dimensi fisik barang (panjang baut, berat sabun) dari 100 sampel lebih.",
      asciiVisual: "  Frekuensi\n   15 |    ___\n   10 |   |   |___\n    5 |___|   |   |___\n    0 +---------------+\n        28  29  30  31 (Ukuran)"
    },
    3: {
      name: "Diagram Pareto",
      tag: "Prioritas 80/20",
      colorTag: "tag-eva",
      superpower: "Memilah 20% biang kerok utama yang memicu 80% total kerugian lantai pabrik.",
      adhdSummary: "Jangan selesaikan semua masalah sekaligus! Bereskan 2 batang grafik paling tinggi, 80% pusing langsung hilang.",
      whenToUse: "Saat tim operasional bingung harus memulai perbaikan dari mana karena jenis cacat terlalu banyak.",
      asciiVisual: " 100% |        ......---\n  80% |   ___  : (80/20)\n      |  |   | :___\n      |  | A | | B | C\n      +-----------------"
    },
    4: {
      name: "Diagram Fishbone (Ishikawa)",
      tag: "Dekonstruksi Akar",
      colorTag: "tag-pro",
      superpower: "Membedah akar penyebab masalah lewat 6 cabang: Man, Machine, Method, Material, Measurement, Environment.",
      adhdSummary: "Kerangka tulang ikan agar saat diskusi tim tidak saling lempar salah, tapi fokus bedah 6 kategori penyebab.",
      whenToUse: "Saat rapat urun rembuk mencari tahu 'kenapa mesin X tiba-tiba menghasilkan produk bocor'.",
      asciiVisual: " Manusia     Mesin      Metode\n    \\          \\          /\n     +----------+--------+-----> [AKAR MASALAH]\n    /          /          \\\n Material  Pengukuran  Lingkungan"
    },
    5: {
      name: "Scatter Diagram (Diagram Tebar)",
      tag: "Uji Korelasi",
      colorTag: "tag-asset",
      superpower: "Plot titik koordinat X dan Y untuk melihat apakah dua variabel proses saling berhubungan erat.",
      adhdSummary: "Membuktikan hubungan: apakah makin panas suhu oven, keramik makin gampang retak? Kalau titiknya miring sejajar, berarti terbukti!",
      whenToUse: "Saat menguji hipotesis penyebab ketidaksesuaian sebelum mengubah setelan mesin.",
      asciiVisual: "  Keretakan ^      * *\n            |    * * *\n            |  * *\n            +------------>\n               Suhu Oven"
    },
    6: {
      name: "Stratifikasi / Flowchart",
      tag: "Segmentasi Data",
      colorTag: "tag-need",
      superpower: "Memilah data gabungan berdasarkan shift kerja, jenis mesin, atau asal bahan untuk melacak sarang masalah.",
      adhdSummary: "Memisahkan data keranjang campur aduk: ternyata cacat cuma muncul di shift malam, shift pagi aman sentosa!",
      whenToUse: "Saat data rata-rata tampak normal tapi ada kelompok kerja tertentu yang sering komplain.",
      asciiVisual: "  Total Cacat -> Pisahkan:\n  [Shift Pagi]  : 2 cacat\n  [Shift Malam] : 48 cacat <-- (Ketemu sarangnya!)"
    },
    7: {
      name: "Control Chart (Peta Kendali)",
      tag: "Stabilitas Proses",
      colorTag: "tag-doc",
      superpower: "Grafik garis runut waktu berpagar CL plus-minus 3 sigma untuk memantau apakah proses stabil atau melanggar batas.",
      adhdSummary: "Pagar pelindung jalan tol. Selama titik masih di dalam pagar, jangan diotak-atik. Begitu lompat keluar, rem seketika!",
      whenToUse: "Pemantauan rutin waktu-nyata oleh operator di lantai pabrik setiap jam.",
      asciiVisual: " UCL +3s -----------------\n         .  *  .       * (ALARM!)\n  CL      *   .  *  .\n LCL -3s -----------------"
    }
  };

  const qcButtons = document.querySelectorAll(".tool-tab-btn");
  const qcDetailContainer = document.getElementById("qc-tool-detail");

  function renderQCTool(id) {
    const data = qcToolsData[id];
    if (!data || !qcDetailContainer) return;

    qcButtons.forEach((b) => {
      if (parseInt(b.dataset.tool, 10) === parseInt(id, 10)) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });

    qcDetailContainer.innerHTML = `
      <div class="tool-detail-card">
        <div class="chunk-head">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="tag ${data.colorTag}">${data.tag}</span>
            <h4 class="chunk-title" style="font-size:18px;">${data.name}</h4>
          </div>
          <span class="chunk-num">Alat #${id}</span>
        </div>
        <div class="punchline-box" style="margin-bottom:14px; background:var(--surface);">
          <span class="icon-box">FUNGSI</span>
          <span>${data.superpower}</span>
        </div>
        <div class="grid-2" style="margin-bottom:14px;">
          <div class="chunk-card" style="background:#f8fafc;">
            <h5 style="margin:0 0 6px; font-family:var(--font-display); font-size:14px;">Intisari ADHD</h5>
            <p style="margin:0; font-size:13px; font-weight:600; color:#1e293b;">${data.adhdSummary}</p>
          </div>
          <div class="chunk-card" style="background:#f8fafc;">
            <h5 style="margin:0 0 6px; font-family:var(--font-display); font-size:14px;">Kapan Wajib Dipakai?</h5>
            <p style="margin:0; font-size:13px; font-weight:600; color:#1e293b;">${data.whenToUse}</p>
          </div>
        </div>
        <div style="background:#0f172a; color:#38bdf8; font-family:'Courier New', monospace; font-size:13px; padding:12px 16px; border-radius:8px; border:2px solid var(--ink); white-space:pre-wrap; box-shadow:var(--shadow-sm);">
${data.asciiVisual}
        </div>
      </div>
    `;
  }

  qcButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const toolId = btn.dataset.tool;
      renderQCTool(toolId);
    });
  });


  // =========================================================
  // 6. INISIALISASI SAAT APLIKASI DIMUAT
  // =========================================================
  window.addEventListener("DOMContentLoaded", () => {
    updateSlide(SLIDE_MIN);
    calculatePAF();
    initSPCPoints();
    startSPCTimer();
    calculateCapability();
    renderQCTool(1);
  });

})();
