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

  const pathIconLight = 'assets/icon/icon-light.png';
  const pathIconDark = 'assets/icon/icon-dark.png';

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
    'UI/UX Designer',
    'Pixel Art Enthusiast',
    'Creative Coder',
    'Problem Solver'
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
  const GROUND_Y = canvas.height - 32;

  let score = 0;
  let hiScore = parseInt(localStorage.getItem('nareka-hiscore') || '0');
  let gameOver = false;
  let started = false;
  let speed = 5;
  let nextSpeedUp = 100;

  const dino = {
    x: 80, y: GROUND_Y, w: 56, h: 60,
    vy: 0, jumping: false, frame: 0, frameTimer: 0,
    dead: false,

    jump() {
      if (!this.jumping && !this.dead) {
        this.vy = -11; // kecepatan lompat
        this.jumping = true;
      }
    },

    update() {
      if (this.dead) return;
      this.vy += 0.6; // gravitasi
      this.y += this.vy;

      if (this.y >= GROUND_Y) {
        this.y = GROUND_Y;
        this.vy = 0;
        this.jumping = false;
      }

      if (!this.jumping && started) {
        this.frameTimer++;
        if (this.frameTimer > 8) {
          this.frame = (this.frame + 1) % 2;
          this.frameTimer = 0;
        }
      }
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
      return { x: this.x - PIXEL * 4, y: this.y - PIXEL * 16, w: PIXEL * 16, h: PIXEL * 16 };
    }
  };

  // Obstacles
  const obstacles = [];
  let obstacleTimer = 0;
  const OBSTACLE_INTERVAL_MIN = 60;
  const OBSTACLE_INTERVAL_RANGE = 70;
  let nextObstacle = OBSTACLE_INTERVAL_MIN + Math.random() * OBSTACLE_INTERVAL_RANGE;

  function spawnObstacle() {
    const types = [
      { w: PIXEL * 5, h: PIXEL * 9 },
      { w: PIXEL * 7, h: PIXEL * 12 },
      { w: PIXEL * 6, h: PIXEL * 10 },
    ];
    const t = types[Math.floor(Math.random() * types.length)];
    obstacles.push({
      x: canvas.width + 20,
      y: GROUND_Y - t.h + PIXEL * 2,
      w: t.w, h: t.h,

      draw(ctx) {
        ctx.save();
        ctx.fillStyle = '#F97316';
        const x = this.x, y = this.y, w = this.w, h = this.h;
        const P = PIXEL;

        // Batang utama
        ctx.fillRect(x + w / 2 - P, y + P * 2, P * 2, h - P * 2);
        // Cabang kiri
        ctx.fillRect(x, y + h / 3 - P, P * 2, P * 4);
        ctx.fillRect(x + P, y + h / 3 + P * 3, P * 2, P * 2);
        // Cabang kanan
        if (h > P * 9) {
          ctx.fillRect(x + w - P * 2, y, P * 2, P * 5);
          ctx.fillRect(x + w - P * 3, y + P * 5, P * 2, P * 2);
        }
        ctx.restore();
      },
      getBounds() {
        return { x: this.x, y: this.y, w: this.w, h: this.h };
      }
    });
  }

  // Clouds & Ground
  const clouds = [];
  let cloudTimer = 0;
  for (let i = 0; i < 3; i++) {
    clouds.push({
      x: Math.random() * canvas.width,
      y: 10 + Math.random() * 40,
      speed: 0.5 + Math.random() * 0.5
    });
  }

  const groundDots = [];
  for (let i = 0; i < 25; i++) {
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
    ctx.fillText(`HI ${String(hiScore).padStart(5, '0')}  ${String(Math.floor(score)).padStart(5, '0')}`, canvas.width - PIXEL * 2, PIXEL * 4 + 8);
    ctx.restore();
  }

  function checkCollision(a, b) {
    const padding = PIXEL;
    return a.x + padding < b.x + b.w && a.x + a.w - padding > b.x &&
      a.y + padding < b.y + b.h && a.y + a.h - padding > b.y;
  }

  function showGameOver(ctx) {
    ctx.save();
    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#F0F0F0' : '#1A1A1A';
    ctx.font = `${PIXEL * 3}px 'Press Start 2P'`;
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, GROUND_Y - PIXEL * 12);
    ctx.font = `${PIXEL * 2}px 'Press Start 2P'`;
    ctx.fillStyle = '#F97316';
    ctx.fillText('PRESS SPACE/TAP TO RESTART', canvas.width / 2, GROUND_Y - PIXEL * 6);
    ctx.restore();
  }

  function showStart(ctx) {
    ctx.save();
    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#F0F0F0' : '#1A1A1A';
    ctx.font = `${PIXEL * 2}px 'Press Start 2P'`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#F97316';
    ctx.fillText('PRESS SPACE / TAP TO WALK', canvas.width / 2, GROUND_Y - PIXEL * 10);
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
    speed = 5;
    nextSpeedUp = 100;
    gameOver = false;
    started = true;
  }

  let animId;
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    cloudTimer++;
    clouds.forEach(c => {
      c.x -= c.speed;
      if (c.x < -80) c.x = canvas.width + 20;
    });
    clouds.forEach(c => drawCloud(ctx, c.x, c.y));
    drawGround(ctx);

    if (started && !gameOver) {
      groundDots.forEach(d => {
        d.x -= speed;
        if (d.x < 0) d.x = canvas.width;
      });

      obstacleTimer++;
      if (obstacleTimer >= nextObstacle) {
        spawnObstacle();
        obstacleTimer = 0;
        nextObstacle = (OBSTACLE_INTERVAL_MIN + Math.random() * OBSTACLE_INTERVAL_RANGE) * Math.max(0.6, 1 - score / 3000);
      }

      for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= speed;
        if (obstacles[i].x + obstacles[i].w < 0) {
          obstacles.splice(i, 1);
          continue;
        }
        obstacles[i].draw(ctx);

        if (checkCollision(dino.getBounds(), obstacles[i].getBounds())) {
          gameOver = true;
          dino.dead = true;
          if (score > hiScore) {
            hiScore = Math.floor(score);
            localStorage.setItem('nareka-hiscore', hiScore);
          }
        }
      }

      dino.update();
      score += 0.1;
      if (score >= nextSpeedUp) {
        speed = Math.min(speed + 0.3, 10); // percepatan
        nextSpeedUp += 100;
      }
    } else {
      obstacles.forEach(o => o.draw(ctx));
    }

    dino.draw(ctx);
    drawScore(ctx);

    if (!started) showStart(ctx);
    if (gameOver) showGameOver(ctx);

    animId = requestAnimationFrame(loop);
  }

  // Controls (Revisi Loop Mulai)
  function handleInput() {
    if (gameOver) {
      reset();
      return;
    }
    if (!started) {
      reset();
      return;
    }

    dino.jump();
  }

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      const section = document.getElementById('hero');
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) handleInput();
      } else {
        handleInput();
      }
    }
  });

  canvas.addEventListener('click', handleInput);
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handleInput(); }, { passive: false });

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
// MUSIC TOGGLE (retro beeps via Web Audio)
// ============================================
function initMusicToggle() {
  const btn = document.getElementById('music-toggle');
  if (!btn) return;

  let audioCtx = null;
  let playing = false;
  let intervalId = null;

  const melody = [523, 659, 784, 659, 784, 880, 784, 659, 523, 440, 523];
  let noteIdx = 0;

  function playNote(freq) {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  }

  btn.addEventListener('click', () => {
    playing = !playing;
    btn.textContent = playing ? '🔊' : '🔇';
    if (playing) {
      intervalId = setInterval(() => {
        playNote(melody[noteIdx % melody.length]);
        noteIdx++;
      }, 300);
    } else {
      clearInterval(intervalId);
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
