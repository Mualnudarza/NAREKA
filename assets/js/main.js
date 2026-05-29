/* ============================================
   NAREKA PORTFOLIO - MAIN JAVASCRIPT
   Pixel Art Retro-Minimalist Portfolio
   ============================================ */

'use strict';

// ============================================
// LOADING SCREEN
// ============================================
(function initLoading() {
  const screen = document.getElementById('loading-screen');
  const bar = document.querySelector('.loading-bar-fill');
  const text = document.querySelector('.loading-text');
  if (!screen) return;

  const messages = ['LOADING...', 'RENDERING PIXELS...', 'SPAWNING DINO...', 'READY!'];
  let progress = 0;
  let msgIdx = 0;

  const tick = setInterval(() => {
    progress += Math.random() * 12 + 3;
    if (progress > 100) progress = 100;

    if (bar) bar.style.width = progress + '%';
    msgIdx = Math.floor((progress / 100) * (messages.length - 1));
    if (text) text.textContent = messages[Math.min(msgIdx, messages.length - 1)];

    if (progress >= 100) {
      clearInterval(tick);
      setTimeout(() => {
        screen.style.opacity = '0';
        screen.style.transition = 'opacity 0.5s ease';
        setTimeout(() => { screen.style.display = 'none'; }, 500);
      }, 400);
    }
  }, 60);
})();

// ============================================
// SCROLL PROGRESS
// ============================================
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = ((scrolled / total) * 100) + '%';
  }, { passive: true });
}

// ============================================
// NAVBAR
// ============================================
function initNavbar() {
  const nav = document.getElementById('navbar');
  const hamburger = document.querySelector('.nav-hamburger');
  const links = document.querySelector('.nav-links');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  if (hamburger && links) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      links.classList.toggle('open');
      document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        links.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? 'var(--orange)' : '';
    });
  }, { passive: true });
}

// ============================================
// DARK MODE
// ============================================
function initDarkMode() {
  const btn = document.getElementById('dark-mode-btn');
  const iconImg = document.getElementById('dark-mode-icon');

  if (!btn || !iconImg) return;

  const pathIconLight = 'assets/icon/icon-light.png'; // Ikon matahari / light mode
  const pathIconDark = 'assets/icon/icon-dark.png';   // Ikon bulan / dark mode

  const saved = localStorage.getItem('nareka-darkmode') === 'true';
  if (saved) {
    document.body.classList.add('dark-mode');
    iconImg.src = pathIconLight;
  } else {
    iconImg.src = pathIconDark;
  }

  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');

    // Ubah src gambar secara dinamis berdasarkan status mode
    iconImg.src = isDark ? pathIconLight : pathIconDark;

    localStorage.setItem('nareka-darkmode', isDark);
  });
}

// ============================================
// TYPING EFFECT
// ============================================
function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const phrases = [
    'Business Analyst',
    'Data Analyst',
    'Data Visualization',
    'Business Intelligence',
    'Data Scientist'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pause = false;

  function type() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        pause = true;
        setTimeout(() => { pause = false; deleting = true; }, 1800);
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    if (!pause) setTimeout(type, deleting ? 60 : 100);
  }
  setTimeout(type, 1600);
}

// ============================================
// FADE IN ANIMATIONS ON SCROLL
// ============================================
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ============================================
// SKILL BARS ANIMATION
// ============================================
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const target = bar.dataset.width || '0';
        setTimeout(() => {
          bar.style.width = target + '%';
        }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => observer.observe(bar));
}

// ============================================
// DINO CANVAS MINI-GAME
// ============================================
function initDinoGame() {
  const canvas = document.getElementById('dino-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Resize canvas
  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const PIXEL = 4;
  const GROUND_Y = canvas.height - 64;
  const COLORS = {
    dino: getComputedStyle(document.documentElement).getPropertyValue('--black').trim() || '#1A1A1A',
    cactus: getComputedStyle(document.documentElement).getPropertyValue('--orange').trim() || '#F97316',
    cloud: '#E0E0E0',
    ground: '#AAAAAA',
    score: '#6B6B6B'
  };

  let score = 0;
  let hiScore = parseInt(localStorage.getItem('nareka-hiscore') || '0');
  let gameOver = false;
  let started = false;
  let speed = 4;
  let nextSpeedUp = 100;

  // Dino state
  const dino = {
    x: 80, y: GROUND_Y, w: 44, h: 52,
    vy: 0, jumping: false, frame: 0, frameTimer: 0,
    dead: false,

    jump() {
      if (!this.jumping && !this.dead) {
        this.vy = -15;
        this.jumping = true;
        if (window._dinoSfx) window._dinoSfx.jump();
      }
    },

    update() {
      if (this.dead) return;
      this.vy += 0.8;
      this.y += this.vy;
      if (this.y >= GROUND_Y) {
        this.y = GROUND_Y;
        this.vy = 0;
        this.jumping = false;
      }
      // Animasi frame dipindah ke luar update() agar bisa berjalan meski belum 'started'
    },

    draw(ctx) {
      ctx.save();
      const isDark = document.body.classList.contains('dark-mode');
      ctx.fillStyle = isDark ? '#F0F0F0' : '#1A1A1A';
      const P = PIXEL;
      const x = this.x;
      const y = this.y;
      const f = this.frame;

      // --- PARASAUROLOPHUS DETAIL PIXEL ---
      // Ekor (Meruncing panjang ke belakang)
      ctx.fillRect(x - P * 8, y - P * 6, P * 3, P);
      ctx.fillRect(x - P * 5, y - P * 7, P * 4, P * 2);

      // Paha Belakang & Perut (Melengkung)
      ctx.fillRect(x - P * 1, y - P * 9, P * 9, P * 6);
      ctx.fillRect(x, y - P * 3, P * 6, P * 2);

      // Dada & Leher Depan
      ctx.fillRect(x + P * 6, y - P * 13, P * 3, P * 6);
      ctx.fillRect(x + P * 5, y - P * 10, P, P * 3);

      // Kepala
      ctx.fillRect(x + P * 6, y - P * 16, P * 4, P * 3);
      // Moncong bawah & atas (Duck-bill)
      ctx.fillRect(x + P * 10, y - P * 14, P * 3, P * 2);
      ctx.fillRect(x + P * 10, y - P * 15, P * 2, P);

      // Jambul (Crest) - Melengkung panjang ke belakang
      ctx.fillRect(x + P * 4, y - P * 18, P * 3, P);
      ctx.fillRect(x + P * 2, y - P * 17, P * 3, P);
      ctx.fillRect(x + P * 4, y - P * 16, P * 2, P);

      // Mata
      ctx.fillStyle = isDark ? '#1A1A1A' : '#fff';
      ctx.fillRect(x + P * 7, y - P * 15, P, P);
      ctx.fillStyle = isDark ? '#F0F0F0' : '#1A1A1A';

      // Lengan depan (T-Rex style tapi lebih panjang sedikit)
      ctx.fillRect(x + P * 8, y - P * 7, P * 2, P * 3);

      // Kaki Bawah (Animasi Jalan)
      if (this.jumping) {
        ctx.fillRect(x + P * 1, y - P * 2, P * 2, P * 2); // Kaki kiri naik
        ctx.fillRect(x + P * 5, y - P * 1, P * 2, P * 2); // Kaki kanan naik
      } else if (f === 0) {
        ctx.fillRect(x + P * 1, y - P * 1, P * 2, P * 3);
        ctx.fillRect(x + P * 6, y - P * 2, P * 2, P * 2);
      } else {
        ctx.fillRect(x + P * 1, y - P * 2, P * 2, P * 2);
        ctx.fillRect(x + P * 5, y - P * 1, P * 2, P * 3);
      }
      ctx.restore();
    },

    getBounds() {
      return { x: this.x + PIXEL, y: this.y - PIXEL * 9, w: this.w - PIXEL * 2, h: PIXEL * 9 };
    }
  };

  // Obstacles
  const obstacles = [];
  let obstacleTimer = 0;
  const OBSTACLE_INTERVAL_MIN = 120;
  const OBSTACLE_INTERVAL_RANGE = 100;
  let nextObstacle = OBSTACLE_INTERVAL_MIN + Math.random() * OBSTACLE_INTERVAL_RANGE;

  function spawnObstacle() {
    // Menambahkan properti 'type' untuk menggambar bentuk spesifik
    const types = [
      { type: 1, w: PIXEL * 4, h: PIXEL * 9 },   // Tipe 1: Kaktus kecil
      { type: 2, w: PIXEL * 8, h: PIXEL * 12 },  // Tipe 2: Kaktus besar Saguaro
      { type: 3, w: PIXEL * 7, h: PIXEL * 10 },  // Tipe 3: Grup 2 kaktus
    ];
    const t = types[Math.floor(Math.random() * types.length)];

    obstacles.push({
      x: canvas.width + 20,
      y: GROUND_Y - t.h + PIXEL * 2,
      w: t.w, h: t.h,
      type: t.type, // Simpan tipe untuk dirender

      draw(ctx) {
        ctx.save();
        // Warnanya menyesuaikan agar kontras namun tetap selaras dengan tema
        ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#F97316' : '#EA580C';
        const x = this.x, y = this.y, w = this.w, h = this.h;
        const P = PIXEL;

        if (this.type === 1) {
          // --- TIPE 1: Kaktus Kecil ---
          ctx.fillRect(x + P, y, P * 2, h);             // Batang utama
          ctx.fillRect(x, y + P * 2, P, P * 3);         // Cabang kiri
          ctx.fillRect(x + P * 3, y + P * 3, P, P * 3); // Cabang kanan
          ctx.fillRect(x, y + P * 4, P * 2, P);         // Sambungan kiri
          ctx.fillRect(x + P * 2, y + P * 5, P * 2, P); // Sambungan kanan

        } else if (this.type === 2) {
          // --- TIPE 2: Kaktus Besar (Saguaro) ---
          ctx.fillRect(x + P * 3, y, P * 2, h);         // Batang utama tebal
          // Cabang kiri
          ctx.fillRect(x, y + P * 2, P * 2, P * 4);
          ctx.fillRect(x + P, y + P * 5, P * 2, P * 2);
          // Cabang kanan
          ctx.fillRect(x + P * 6, y + P * 4, P * 2, P * 4);
          ctx.fillRect(x + P * 5, y + P * 7, P * 2, P * 2);

        } else if (this.type === 3) {
          // --- TIPE 3: Grup 2 Kaktus ---
          // Kaktus Pertama (Kiri, lebih pendek)
          ctx.fillRect(x, y + P * 2, P * 2, h - P * 2);
          ctx.fillRect(x - P, y + P * 4, P, P * 2);     // Cabang luar kiri
          ctx.fillRect(x - P, y + P * 5, P * 2, P);
          // Kaktus Kedua (Kanan, lebih tinggi)
          ctx.fillRect(x + P * 4, y, P * 2, h);
          ctx.fillRect(x + P * 6, y + P * 3, P, P * 3); // Cabang luar kanan
          ctx.fillRect(x + P * 5, y + P * 5, P * 2, P);
        }

        ctx.restore();
      },

      getBounds() {
        // Area tabrakan (hitbox) dibuat sedikit lebih kecil ke dalam (padding 1 Pixel) 
        // agar game terasa lebih adil dan tidak terlalu sensitif saat disentuh ekor dino
        return { x: this.x + PIXEL, y: this.y + PIXEL, w: this.w - PIXEL * 2, h: this.h - PIXEL };
      }
    });
  }

  // Clouds
  const clouds = [];
  let cloudTimer = 0;
  for (let i = 0; i < 3; i++) {
    clouds.push({
      x: Math.random() * canvas.width,
      y: 20 + Math.random() * 50,
      speed: 0.5 + Math.random() * 0.5
    });
  }

  // Ground particles
  const groundDots = [];
  for (let i = 0; i < 20; i++) {
    groundDots.push({ x: Math.random() * canvas.width, size: PIXEL * (Math.random() < 0.5 ? 1 : 2) });
  }

  function drawCloud(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#333' : '#E0E0E0';
    const P = PIXEL;
    ctx.fillRect(x, y + P, P * 8, P * 2);
    ctx.fillRect(x + P, y, P * 6, P);
    ctx.fillRect(x + P * 2, y - P, P * 4, P);
    ctx.restore();
  }

  function drawGround(ctx) {
    ctx.save();
    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#333' : '#AAAAAA';
    ctx.fillRect(0, GROUND_Y + PIXEL * 2, canvas.width, 3);
    groundDots.forEach(d => {
      ctx.fillRect(d.x, GROUND_Y + PIXEL * 3, d.size, d.size);
    });
    ctx.restore();
  }

  function drawScore(ctx) {
    ctx.save();
    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#555' : '#AAAAAA';
    ctx.font = `${PIXEL * 3}px 'Press Start 2P'`;
    ctx.textAlign = 'right';
    // Gunakan Math.floor(score) agar angka desimal tidak tampil di layar
    ctx.fillText(`HI ${String(hiScore).padStart(5, '0')}  ${String(Math.floor(score)).padStart(5, '0')}`, canvas.width - PIXEL * 2, PIXEL * 4 + 8);
    ctx.restore();
  }

  function checkCollision(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function showGameOver(ctx) {
    ctx.save();
    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#F0F0F0' : '#1A1A1A';
    ctx.font = `${PIXEL * 3}px 'Press Start 2P'`;
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, GROUND_Y - PIXEL * 10);
    ctx.font = `${PIXEL * 2}px 'Press Start 2P'`;
    ctx.fillStyle = '#F97316';
    ctx.fillText('PRESS SPACE/TAP TO RESTART', canvas.width / 2, GROUND_Y - PIXEL * 5);
    ctx.restore();
  }

  function showStart(ctx) {
    ctx.save();
    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#F0F0F0' : '#1A1A1A';
    ctx.font = `${PIXEL * 2}px 'Press Start 2P'`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#F97316';
    ctx.fillText('PRESS SPACE / TAP TO START', canvas.width / 2, GROUND_Y - PIXEL * 5);
    ctx.restore();
  }

  function reset() {
    dino.y = GROUND_Y;
    dino.vy = 0;
    dino.jumping = false;
    dino.dead = false;
    dino.frame = 0;
    obstacles.length = 0;
    obstacleTimer = 0;
    nextObstacle = OBSTACLE_INTERVAL_MIN + Math.random() * OBSTACLE_INTERVAL_RANGE;
    score = 0;
    speed = 4;
    nextSpeedUp = 100;
    gameOver = false;
    started = true;
  }

  let animId;
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
      // 1. ENVIRONMENT BERJALAN OTOMATIS (Awan & Tanah)
      cloudTimer++;
      clouds.forEach(c => {
        c.x -= c.speed;
        if (c.x < -80) c.x = canvas.width + 20;
      });

      groundDots.forEach(d => {
        d.x -= speed;
        if (d.x < 0) d.x = canvas.width;
      });

      // Animasi kaki dino terus berjalan sebagai estetika walau belum 'started'
      if (!dino.jumping) {
        dino.frameTimer++;
        if (dino.frameTimer > 8) {
          dino.frame = (dino.frame + 1) % 2;
          dino.frameTimer = 0;
        }
      }
    }

    // Menggambar Awan & Tanah
    clouds.forEach(c => drawCloud(ctx, c.x, c.y));
    drawGround(ctx);

    if (started && !gameOver) {
      // 2. LOGIKA KETIKA BERMAIN
      obstacleTimer++;
      if (obstacleTimer >= nextObstacle) {
        spawnObstacle();
        obstacleTimer = 0;
        nextObstacle = (OBSTACLE_INTERVAL_MIN + Math.random() * OBSTACLE_INTERVAL_RANGE) * Math.max(0.5, 1 - score / 2000);
      }

      for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= speed;
        if (obstacles[i].x + obstacles[i].w < 0) {
          obstacles.splice(i, 1);
          continue;
        }
        obstacles[i].draw(ctx);

        // Collision
        if (checkCollision(dino.getBounds(), obstacles[i].getBounds())) {
          gameOver = true;
          dino.dead = true;
          if (window._dinoSfx) window._dinoSfx.gameOver();
          // Gunakan Math.floor untuk perbandingan hiScore
          if (Math.floor(score) > hiScore) {
            hiScore = Math.floor(score);
            localStorage.setItem('nareka-hiscore', hiScore);
          }
        }
      }

      dino.update();

      // 1. Perlambat skor (bertambah 0.08 per frame, butuh waktu lebih lama untuk mencapai 100)
      score += 0.08;

      // 2. Naikkan kecepatan secara halus setiap kelipatan 100
      if (score >= nextSpeedUp) {
        speed = Math.min(speed + 0.25, 9); // Naik hanya 0.25 (sangat halus), batas maksimal speed 9
        nextSpeedUp += 100; // Set target naik kecepatan berikutnya
      }
    } else {
      // Gambar kaktus yang tersisa agar tetap terlihat saat game belum mulai / game over
      obstacles.forEach(o => o.draw(ctx));
    }

    dino.draw(ctx);
    drawScore(ctx);

    if (!started) showStart(ctx);

    // 3. JIKA GAME OVER, HENTIKAN LOOP
    if (gameOver) {
      showGameOver(ctx);
      return; // Tidak memanggil requestAnimationFrame, sehingga layar benar-benar berhenti
    }

    animId = requestAnimationFrame(loop);
  }

  // Controls
  function handleJump() {
    if (gameOver) {
      reset();
      loop(); // Panggil kembali loop karena sebelumnya dihentikan
      return;
    }
    if (!started) {
      reset();
      return; // Klik pertama hanya akan memulai game tanpa langsung melompat
    }
    dino.jump();
  }

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      // Only act if dino section visible
      const section = document.getElementById('hero');
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) handleJump();
      }
    }
  });

  canvas.addEventListener('click', handleJump);
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handleJump(); }, { passive: false });

  loop();
}

// ============================================
// PROJECT CARD CANVAS THUMBNAILS
// ============================================
function drawProjectThumbnail(canvas, colorScheme) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.offsetWidth;
  const h = canvas.height = canvas.offsetHeight || 200;
  const P = 8;

  ctx.clearRect(0, 0, w, h);

  // Background
  ctx.fillStyle = colorScheme.bg;
  ctx.fillRect(0, 0, w, h);

  // Pixel grid
  ctx.strokeStyle = colorScheme.grid;
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += P * 4) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += P * 4) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // Decorative pixels
  const rects = [
    [0.2, 0.2, P * 6, P * 4],
    [0.5, 0.3, P * 4, P * 6],
    [0.7, 0.15, P * 5, P * 3],
    [0.15, 0.6, P * 3, P * 5],
    [0.6, 0.6, P * 7, P * 4],
    [0.35, 0.7, P * 4, P * 3],
  ];

  rects.forEach(([rx, ry, rw, rh]) => {
    ctx.fillStyle = colorScheme.accent;
    ctx.globalAlpha = 0.6 + Math.random() * 0.4;
    ctx.fillRect(rx * w, ry * h, rw, rh);
  });

  // Central logo pixel art
  ctx.globalAlpha = 1;
  ctx.fillStyle = colorScheme.accent;
  const cx = w / 2 - P * 4;
  const cy = h / 2 - P * 4;
  // Simple window/browser icon
  ctx.fillRect(cx, cy, P * 8, P * 8);
  ctx.fillStyle = colorScheme.bg;
  ctx.fillRect(cx + P, cy + P * 2, P * 6, P * 5);
  ctx.fillStyle = colorScheme.accent;
  ctx.fillRect(cx + P, cy + P, P * 2, P);
  ctx.fillRect(cx + P * 3, cy + P, P * 2, P);

  ctx.globalAlpha = 1;
}

function initProjectThumbnails() {
  const schemes = [
    { bg: '#FFF7ED', grid: '#FED7AA22', accent: '#F97316' },
    { bg: '#F0FDF4', grid: '#BBF7D022', accent: '#22C55E' },
    { bg: '#EFF6FF', grid: '#BFDBFE22', accent: '#3B82F6' },
    { bg: '#FDF4FF', grid: '#F5D0FE22', accent: '#A855F7' },
    { bg: '#FFF1F2', grid: '#FECDD322', accent: '#F43F5E' },
    { bg: '#F0FDFA', grid: '#99F6E422', accent: '#14B8A6' },
  ];

  document.querySelectorAll('.project-thumb').forEach((canvas, i) => {
    const scheme = schemes[i % schemes.length];
    setTimeout(() => drawProjectThumbnail(canvas, scheme), 100 * i);
  });
}

// ============================================
// PIXEL AVATAR CANVAS
// ============================================
function drawPixelAvatar() {
  const canvas = document.getElementById('avatar-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const P = 8;
  canvas.width = 220;
  canvas.height = 220;

  const isDark = document.body.classList.contains('dark-mode');
  const skin = '#FFCC99';
  const hair = isDark ? '#E0E0E0' : '#2D2D2D';
  const shirt = '#F97316';
  const bg = isDark ? '#2a1a0a' : '#FFF7ED';

  ctx.imageSmoothingEnabled = false;

  // BG
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 220, 220);

  // Pixel grid overlay
  ctx.strokeStyle = isDark ? '#3a2a1a' : '#FED7AA';
  ctx.lineWidth = 1;
  for (let x = 0; x < 220; x += P * 2) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 220); ctx.stroke();
  }
  for (let y = 0; y < 220; y += P * 2) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(220, y); ctx.stroke();
  }

  const draw = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * P, y * P, w * P, h * P);
  };

  // Body (centered in 220x220 = 27.5 pixels)
  const ox = 6; // offset
  const oy = 3;

  // Hair
  draw(ox + 2, oy + 1, 9, 3, hair);
  draw(ox + 1, oy + 2, 11, 2, hair);
  draw(ox + 1, oy + 4, 2, 3, hair);
  draw(ox + 10, oy + 4, 2, 3, hair);

  // Face
  draw(ox + 2, oy + 3, 9, 7, skin);

  // Eyes
  draw(ox + 3, oy + 5, 2, 2, '#2D2D2D');
  draw(ox + 8, oy + 5, 2, 2, '#2D2D2D');

  // Smile
  draw(ox + 4, oy + 8, 1, 1, '#2D2D2D');
  draw(ox + 8, oy + 8, 1, 1, '#2D2D2D');
  draw(ox + 5, oy + 9, 3, 1, '#2D2D2D');

  // Neck
  draw(ox + 5, oy + 10, 3, 2, skin);

  // Shirt/Body
  draw(ox + 2, oy + 12, 9, 7, shirt);

  // Collar
  draw(ox + 5, oy + 12, 3, 2, '#EA580C');

  // Arms
  draw(ox, oy + 12, 3, 5, shirt);
  draw(ox + 10, oy + 12, 3, 5, shirt);

  // Hands
  draw(ox, oy + 17, 3, 2, skin);
  draw(ox + 10, oy + 17, 3, 2, skin);

  // Laptop
  draw(ox + 2, oy + 18, 9, 5, '#2D2D2D');
  draw(ox + 3, oy + 19, 7, 3, '#3B82F6');
  draw(ox + 4, oy + 20, 2, 1, '#F97316');
  draw(ox + 7, oy + 20, 1, 1, '#F97316');

  // Orange highlight on shirt
  draw(ox + 4, oy + 14, 5, 1, '#FED7AA');
}

// ============================================
// PROJECT FILTER
// ============================================
function initProjectFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = ''; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-send-btn');
    const original = btn.textContent;
    btn.textContent = 'SENDING...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ SENT!';
      showToast('Message sent! I\'ll get back to you soon ✨');
      form.reset();
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 3000);
    }, 1500);
  });
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============================================
// BACK TO TOP
// ============================================
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// EASTER EGG
// ============================================
function initEasterEgg() {
  const trigger = document.getElementById('easter-trigger');
  const modal = document.getElementById('easter-egg');
  const close = document.getElementById('easter-close');
  if (!trigger || !modal) return;

  trigger.addEventListener('click', () => {
    modal.classList.add('active');
  });

  if (close) close.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  // Konami code
  let konamiSeq = [];
  const code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  document.addEventListener('keydown', (e) => {
    konamiSeq.push(e.keyCode);
    if (konamiSeq.length > code.length) konamiSeq.shift();
    if (konamiSeq.join() === code.join()) {
      modal.classList.add('active');
      showToast('🦕 KONAMI CODE UNLOCKED!');
    }
  });
}

// ============================================
// RETRO DINO AMBIENCE MUSIC
// Segment-Loop Day/Night Soundtrack
// ============================================

function initMusicToggle() {

  const btn = document.getElementById('music-toggle');
  if (!btn) return;

  // ============================================
  // AUDIO ENGINE
  // ============================================

  let audioCtx = null;
  let masterGain = null;
  let lowpass = null;
  let compressor = null;
  let activeOsc = 0;
  const MAX_OSC = 16;

  function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.7, audioCtx.currentTime);

    lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 3200;
    lowpass.Q.value = 0.5;

    compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-22, audioCtx.currentTime);
    compressor.knee.setValueAtTime(14, audioCtx.currentTime);
    compressor.ratio.setValueAtTime(5, audioCtx.currentTime);
    compressor.attack.setValueAtTime(0.008, audioCtx.currentTime);
    compressor.release.setValueAtTime(0.22, audioCtx.currentTime);

    masterGain.connect(lowpass);
    lowpass.connect(compressor);
    compressor.connect(audioCtx.destination);
  }

  // [schedule note — anti-crack envelope]

  function scheduleNote(freq, startTime, dur, vol, wave) {
    if (!freq || !audioCtx) return;
    if (activeOsc >= MAX_OSC) return;

    const d = Math.max(dur, 0.05);
    const attack = Math.min(0.022, d * 0.18);
    const release = Math.min(0.075, d * 0.38);
    const holdEnd = Math.max(startTime + attack, startTime + d - release);
    const v = Math.min(Math.max(vol, 0.0001), 0.45);

    const osc = audioCtx.createOscillator();
    const gn = audioCtx.createGain();

    osc.type = wave;
    osc.frequency.setValueAtTime(freq, startTime);

    gn.gain.setValueAtTime(0.0001, startTime);
    gn.gain.linearRampToValueAtTime(v, startTime + attack);
    gn.gain.setValueAtTime(v, holdEnd);
    gn.gain.exponentialRampToValueAtTime(0.0001, startTime + d);

    osc.connect(gn);
    gn.connect(masterGain);
    osc.start(startTime);
    osc.stop(startTime + d + 0.008);

    activeOsc++;
    osc.onended = () => { activeOsc--; osc.disconnect(); gn.disconnect(); };
  }

  // ============================================
  // NOTE TABLE
  // ============================================

  const N = {
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61,
    G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
    G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25,
    R: 0
  };

  // ============================================
  // DAY SEGMENTS — energetic, arcade, fast
  // BPM ~160 | step = 0.187s
  // square dominant, intense beat
  // ============================================

  const DAY_STEP = 0.1875;  // 60/160/2
  const DAY_LOOKAHEAD = 0.12;
  const DAY_TICK = 22;

  const DAY_SEGMENTS = [

    // 0 — Dino Sprint (C major pentatonic run)
    {
      name: 'DINO SPRINT',
      melody: [N.C4, N.E4, N.G4, N.C5, N.G4, N.E4, N.C4, N.E4,
      N.G4, N.C5, N.E5, N.C5, N.G4, N.E4, N.G4, N.C4],
      bass: [N.C3, N.G3, N.C3, N.G3],
      loop: 2
    },

    // 1 — Pixel Rush (G major, upward energy)
    {
      name: 'PIXEL RUSH',
      melody: [N.G4, N.B4, N.D5, N.B4, N.G4, N.D4, N.G4, N.B4,
      N.D5, N.G4, N.D5, N.B4, N.D4, N.G4, N.B4, N.D5],
      bass: [N.G3, N.D3, N.G3, N.B3],
      loop: 2
    },

    // 2 — Arcade Jump (F major, bouncy)
    {
      name: 'ARCADE JUMP',
      melody: [N.F4, N.A4, N.C5, N.A4, N.F4, N.C4, N.F4, N.A4,
      N.C5, N.A4, N.C5, N.E5, N.C5, N.A4, N.F4, N.C4],
      bass: [N.F3, N.C3, N.F3, N.A3],
      loop: 2
    },

    // 3 — Turbo Run (D major, driving)
    {
      name: 'TURBO RUN',
      melody: [N.D4, N.F4, N.A4, N.D5, N.A4, N.F4, N.D4, N.A4,
      N.D5, N.A4, N.F4, N.D5, N.A4, N.F4, N.A4, N.D4],
      bass: [N.D3, N.A3, N.D3, N.F3],
      loop: 2
    },

    // 4 — Score Attack (E minor, tense energy)
    {
      name: 'SCORE ATTACK',
      melody: [N.E4, N.G4, N.B4, N.E5, N.B4, N.G4, N.E4, N.B3,
      N.E4, N.G4, N.B4, N.D5, N.B4, N.G4, N.E4, N.G4],
      bass: [N.E3, N.B3, N.G3, N.B3],
      loop: 2
    },

    // 5 — Level Up (A major, bright)
    {
      name: 'LEVEL UP',
      melody: [N.A4, N.C5, N.E5, N.C5, N.A4, N.E4, N.A4, N.C5,
      N.E5, N.C5, N.A4, N.C5, N.E4, N.A4, N.E4, N.C4],
      bass: [N.A3, N.E3, N.A3, N.C4],
      loop: 2
    },

    // 6 — Hyper Dash (C pentatonic, short loop)
    {
      name: 'HYPER DASH',
      melody: [N.C5, N.G4, N.E4, N.G4, N.C5, N.E5, N.C5, N.G4],
      bass: [N.C3, N.G3, N.E3, N.G3],
      loop: 3
    },

    // 7 — Coin Chase (G pentatonic, syncopated)
    {
      name: 'COIN CHASE',
      melody: [N.G4, N.A4, N.B4, N.D5, N.B4, N.A4, N.G4, N.E4,
      N.G4, N.B4, N.D5, N.B4, N.G4, N.D4, N.G4, N.B4],
      bass: [N.G3, N.D3, N.B3, N.D3],
      loop: 2
    }

  ];

  // ============================================
  // NIGHT SEGMENTS — chill, slow, ambient
  // BPM ~76 | step = ~0.394s
  // triangle/sine dominant, sparse
  // ============================================

  const NIGHT_STEP = 0.3947;  // 60/76/2
  const NIGHT_LOOKAHEAD = 0.18;
  const NIGHT_TICK = 30;

  const NIGHT_SEGMENTS = [

    // 0 — Moonlit Run (C maj7, floating)
    {
      name: 'MOONLIT RUN',
      melody: [N.C4, N.E4, N.G4, N.B4, N.G4, N.E4, N.C4, N.E4],
      bass: [N.C3, N.G3, N.E3, N.G3],
      loop: 3
    },

    // 1 — Night Dino (A minor, wistful)
    {
      name: 'NIGHT DINO',
      melody: [N.A4, N.G4, N.E4, N.G4, N.A4, N.C5, N.A4, N.G4],
      bass: [N.A3, N.E3, N.A3, N.C4],
      loop: 2
    },

    // 2 — Starfield (G major, airy)
    {
      name: 'STARFIELD',
      melody: [N.G4, N.B4, N.D5, N.B4, N.D5, N.B4, N.G4, N.D4],
      bass: [N.G3, N.D3, N.B3, N.D3],
      loop: 2
    },

    // 3 — Dusk Wander (F major, relaxed)
    {
      name: 'DUSK WANDER',
      melody: [N.F4, N.A4, N.C5, N.A4, N.F4, N.E4, N.F4, N.A4],
      bass: [N.F3, N.C3, N.F3, N.A3],
      loop: 3
    },

    // 4 — Pixel Dusk (E minor, melancholy)
    {
      name: 'PIXEL DUSK',
      melody: [N.E4, N.G4, N.B4, N.G4, N.E4, N.D4, N.E4, N.G4],
      bass: [N.E3, N.B3, N.G3, N.B3],
      loop: 2
    },

    // 5 — Late Lap (C sparse, rests)
    {
      name: 'LATE LAP',
      melody: [N.G4, N.R, N.E4, N.R, N.C5, N.R, N.E4, N.G4],
      bass: [N.C3, N.R, N.G3, N.R],
      loop: 3
    },

    // 6 — Desert Night (D major, slow ascend)
    {
      name: 'DESERT NIGHT',
      melody: [N.D4, N.F4, N.A4, N.C5, N.A4, N.F4, N.D4, N.A3],
      bass: [N.D3, N.A3, N.F3, N.A3],
      loop: 2
    },

    // 7 — Chill Fossil (A dorian, warm minor)
    {
      name: 'CHILL FOSSIL',
      melody: [N.A4, N.G4, N.E4, N.G4, N.A4, N.G4, N.E4, N.C4],
      bass: [N.A3, N.E3, N.C4, N.E3],
      loop: 3
    }

  ];

  // ============================================
  // PLAYBACK STATE
  // ============================================

  let playing = false;
  let schedulerTimer = null;

  let nextNoteTime = 0;
  let melodyStep = 0;
  let segLoopCount = 0;
  let lastSegIdx = -1;
  let currentSeg = null;
  let nextSegIdx = -1;

  // [active config — set on start/mode switch]
  let STEP_SEC = DAY_STEP;
  let LOOKAHEAD = DAY_LOOKAHEAD;
  let SCHED_TICK = DAY_TICK;
  let SEGMENTS = DAY_SEGMENTS;
  let isDarkMode = false;

  // ============================================
  // SEGMENT MANAGER
  // ============================================

  function pickNextSeg(avoid) {
    if (SEGMENTS.length === 1) return 0;
    let idx, tries = 0;
    do { idx = Math.floor(Math.random() * SEGMENTS.length); tries++; }
    while (idx === avoid && tries < 10);
    return idx;
  }

  function loadSeg(idx) {
    currentSeg = SEGMENTS[idx];
    lastSegIdx = idx;
    segLoopCount = 0;
    melodyStep = 0;
  }

  // ============================================
  // STEP SCHEDULER
  // ============================================

  function scheduleStep() {
    const seg = currentSeg;
    const step = melodyStep;
    const isBeat = (step % 4 === 0);
    const t = nextNoteTime;

    // [melody]
    const mFreq = seg.melody[step];
    if (mFreq) {
      const mWave = (!isDarkMode && mFreq < 480) ? (isBeat ? 'square' : 'triangle') : 'triangle';
      const mVol = isDarkMode
        ? (isBeat ? 0.048 : 0.036)
        : (isBeat ? 0.060 : 0.046);
      scheduleNote(mFreq, t, STEP_SEC * 0.78, mVol, mWave);
    }

    // [bass — every quarter note]
    if (step % 2 === 0) {
      const bIdx = Math.floor(step / 2) % seg.bass.length;
      const bFreq = seg.bass[bIdx];
      if (bFreq) {
        const bVol = isDarkMode ? 0.022 : 0.030;
        scheduleNote(bFreq, t, STEP_SEC * 1.6, bVol, 'triangle');
      }
    }

    // [pad — every 4 steps, octave below melody]
    if (step % 4 === 0 && mFreq) {
      const padFreq = mFreq * 0.5;
      if (padFreq >= 90 && padFreq <= 400) {
        const padVol = isDarkMode ? 0.014 : 0.010;
        scheduleNote(padFreq, t + STEP_SEC * 0.02, STEP_SEC * 2.0, padVol, 'sine');
      }
    }

    nextNoteTime += STEP_SEC;
    melodyStep++;

    if (melodyStep >= seg.melody.length) {
      melodyStep = 0;
      segLoopCount++;
      if (segLoopCount >= seg.loop) {
        const nxt = nextSegIdx >= 0 ? nextSegIdx : pickNextSeg(lastSegIdx);
        nextSegIdx = -1;
        loadSeg(nxt);
      }
    }
  }

  // ============================================
  // LOOK-AHEAD SCHEDULER
  // ============================================

  function schedulerTick() {
    if (!playing) return;
    const horizon = audioCtx.currentTime + LOOKAHEAD;
    while (nextNoteTime < horizon) scheduleStep();
    schedulerTimer = setTimeout(schedulerTick, SCHED_TICK);
  }

  // ============================================
  // TRANSPORT
  // ============================================

  function getMode() {
    return document.body.classList.contains('dark-mode');
  }

  function applyMode() {
    isDarkMode = getMode();
    SEGMENTS = isDarkMode ? NIGHT_SEGMENTS : DAY_SEGMENTS;
    STEP_SEC = isDarkMode ? NIGHT_STEP : DAY_STEP;
    LOOKAHEAD = isDarkMode ? NIGHT_LOOKAHEAD : DAY_LOOKAHEAD;
    SCHED_TICK = isDarkMode ? NIGHT_TICK : DAY_TICK;
  }

  async function startMusic() {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') await audioCtx.resume();

    applyMode();
    loadSeg(pickNextSeg(-1));
    nextNoteTime = audioCtx.currentTime + 0.06;
    playing = true;
    schedulerTick();
  }

  function stopMusic() {
    playing = false;
    clearTimeout(schedulerTimer);
    schedulerTimer = null;
  }

  // ============================================
  // SFX
  // ============================================

  function sfxJump() {
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gn = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(660, t + 0.08);
    gn.gain.setValueAtTime(0.0001, t);
    gn.gain.linearRampToValueAtTime(0.12, t + 0.01);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc.connect(gn); gn.connect(masterGain);
    osc.start(t); osc.stop(t + 0.13);
    osc.onended = () => { osc.disconnect(); gn.disconnect(); };
  }

  function sfxGameOver() {
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    [[392, 0.00], [330, 0.12], [262, 0.24], [196, 0.38]].forEach(([freq, offset]) => {
      const osc = audioCtx.createOscillator();
      const gn = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t + offset);
      gn.gain.setValueAtTime(0.0001, t + offset);
      gn.gain.linearRampToValueAtTime(0.09, t + offset + 0.015);
      gn.gain.exponentialRampToValueAtTime(0.0001, t + offset + 0.10);
      osc.connect(gn); gn.connect(masterGain);
      osc.start(t + offset); osc.stop(t + offset + 0.11);
      osc.onended = () => { osc.disconnect(); gn.disconnect(); };
    });
  }

  // [expose SFX to dino game]
  window._dinoSfx = { jump: sfxJump, gameOver: sfxGameOver };

  // ============================================
  // CONTROLS
  // ============================================

  // [music toggle]
  btn.addEventListener('click', async () => {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') await audioCtx.resume();

    playing = !playing;
    btn.textContent = playing ? '🔊' : '🔇';

    if (playing) {
      await startMusic();
    } else {
      stopMusic();
    }
  });

  // [mode switch — restart with new character]
  const darkBtn = document.getElementById('dark-mode-btn');
  if (darkBtn) {
    darkBtn.addEventListener('click', () => {
      if (!playing) return;
      stopMusic();
      setTimeout(async () => { if (playing) await startMusic(); }, 200);
    });
  }

  // [page visibility]
  document.addEventListener('visibilitychange', () => {
    if (!audioCtx) return;
    if (document.hidden) {
      audioCtx.suspend();
    } else if (playing) {
      audioCtx.resume().then(() => {
        nextNoteTime = audioCtx.currentTime + 0.06;
        schedulerTick();
      });
    }
  });
}

// ============================================
// PARALLAX (light)
// ============================================
function initParallax() {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    document.querySelectorAll('.parallax-slow').forEach(el => {
      el.style.transform = `translateY(${scrolled * 0.2}px)`;
    });
    document.querySelectorAll('.parallax-med').forEach(el => {
      el.style.transform = `translateY(${scrolled * 0.1}px)`;
    });
  }, { passive: true });
}

// ============================================
// PIXEL HOVER SOUND
// ============================================
function initHoverSounds() {
  let audioCtx = null;
  function beep(freq = 440, dur = 0.05) {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return; }
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    osc.start(); osc.stop(audioCtx.currentTime + dur);
  }

  document.querySelectorAll('.btn-pixel, .nav-links a, .skill-tag, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => beep(600, 0.04));
  });
}

// ============================================
// SMOOTH SECTION TRANSITIONS
// ============================================
function initSectionIndicator() {
  const sections = document.querySelectorAll('section[id]');
  const indicators = document.querySelectorAll('.scroll-dot');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        indicators.forEach(d => d.classList.remove('active'));
        const dot = document.querySelector(`.scroll-dot[data-section="${entry.target.id}"]`);
        if (dot) dot.classList.add('active');
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => observer.observe(s));
}

// ============================================
// INIT ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavbar();
  initDarkMode();
  initTyping();
  initScrollAnimations();
  initSkillBars();
  initDinoGame();
  initProjectFilter();
  initContactForm();
  initBackToTop();
  initEasterEgg();
  initMusicToggle();
  initParallax();
  initHoverSounds();
  initSectionIndicator();

  // Draw avatar after a tick
  setTimeout(() => {
    drawPixelAvatar();
    initProjectThumbnails();
  }, 100);

  // Re-draw on dark mode toggle
  document.getElementById('dark-mode-btn')?.addEventListener('click', () => {
    setTimeout(() => { drawPixelAvatar(); }, 50);
  });
});