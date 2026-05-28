/**
 * =====================================================
 *  MARKTYPE — script.js
 *  Markdown Typing Reader · Full Client-Side
 * =====================================================
 */

// ─────────────────────────────────────────────────────
//  STATE
// ─────────────────────────────────────────────────────

const State = {
  // Document
  currentFile:    null,   // { name, content }
  sections:       [],     // parsed sections array
  currentSection: null,   // selected section index

  // Typing session
  targetText:     '',
  inputHistory:   [],     // per-char typed input for tracking
  currentIndex:   0,
  totalErrors:    0,
  extraChars:     0,

  // Timer
  startTime:      null,
  elapsedSeconds: 0,
  timerInterval:  null,
  idleTimeout:    null,
  isPaused:       false,
  isFinished:     false,

  // Mode
  focusMode:      false,
};

// ─────────────────────────────────────────────────────
//  BUILT-IN MATERIALS (fetched from /materials/)
// ─────────────────────────────────────────────────────

const MATERIALS = [
  { id: 'marketing', file: 'materials/marketing.md', icon: '📈', name: 'Marketing Fundamentals', desc: 'Core principles of modern marketing' },
  { id: 'sales',     file: 'materials/sales.md',     icon: '🤝', name: 'Sales Mastery',          desc: 'Art and science of selling' },
  { id: 'psychology',file: 'materials/psychology.md',icon: '🧠', name: 'Psychology of Learning', desc: 'How we learn and remember' },
];

// ─────────────────────────────────────────────────────
//  DOM REFERENCES
// ─────────────────────────────────────────────────────

const $ = id => document.getElementById(id);

const DOM = {
  // Screens
  screenHome:    $('screen-home'),
  screenPicker:  $('screen-picker'),
  screenTyping:  $('screen-typing'),
  screenResults: $('screen-results'),

  // Home
  materialsList: $('materials-list'),
  fileInput:     $('file-input'),
  uploadZone:    $('upload-zone'),
  historyCard:   $('history-card'),
  lastSession:   $('last-session'),
  statsBar:      $('stats-bar'),
  statBestWpm:   $('stat-best-wpm'),
  statSessions:  $('stat-sessions'),
  statAvgAcc:    $('stat-avg-acc'),

  // Picker
  pickerFilename: $('picker-filename'),
  pickerDocTitle: $('picker-doc-title'),
  pickerDocMeta:  $('picker-doc-meta'),
  tocList:        $('toc-list'),
  btnBackHome:    $('btn-back-home'),

  // Typing
  typingHud:      $('typing-hud'),
  hudWpm:         $('hud-wpm'),
  hudAcc:         $('hud-acc'),
  hudTimer:       $('hud-timer'),
  hudProgress:    $('hud-progress'),
  progressFill:   $('progress-fill'),
  typingContainer:$('typing-container'),
  sectionLabel:   $('section-label'),
  displayText:    $('display-text'),
  typingInput:    $('typing-input'),
  typingHint:     $('typing-hint'),
  btnExitTyping:  $('btn-exit-typing'),
  btnFocusMode:   $('btn-focus-mode'),

  // Results
  resultsSectionName: $('results-section-name'),
  resWpm:     $('res-wpm'),
  resAcc:     $('res-acc'),
  resTime:    $('res-time'),
  resTypos:   $('res-typos'),
  resChars:   $('res-chars'),
  resWords:   $('res-words'),
  btnRetry:   $('btn-retry'),
  btnNextSection: $('btn-next-section'),
  btnResultsHome: $('btn-results-home'),
};

// ─────────────────────────────────────────────────────
//  SCREEN MANAGEMENT
// ─────────────────────────────────────────────────────

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = $(`screen-${name}`);
  if (screen) screen.classList.add('active');
}

// ─────────────────────────────────────────────────────
//  MARKDOWN PARSING
// ─────────────────────────────────────────────────────

/**
 * Parse markdown content into sections.
 * Each heading (h1/h2/h3) starts a new section.
 */
function parseMarkdown(content) {
  const lines = content.split('\n');
  const sections = [];
  let current = null;

  for (const line of lines) {
    const h1 = line.match(/^#\s+(.+)/);
    const h2 = line.match(/^##\s+(.+)/);
    const h3 = line.match(/^###\s+(.+)/);

    if (h1 || h2 || h3) {
      if (current) sections.push(current);
      const level = h1 ? 1 : h2 ? 2 : 3;
      const title = (h1 || h2 || h3)[1].trim();
      current = { title, level, lines: [], rawText: '' };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);

  // Build plain text for each section (strip markdown syntax)
  sections.forEach(sec => {
    const joined = sec.lines.join('\n').trim();
    sec.rawText = stripMarkdown(joined);
  });

  // Filter out empty sections
  return sections.filter(s => s.rawText.length > 20);
}

/**
 * Strip basic markdown formatting to get plain text.
 */
function stripMarkdown(text) {
  return text
    .replace(/^#{1,6}\s+/gm, '')          // headings
    .replace(/\*\*(.+?)\*\*/g, '$1')      // bold
    .replace(/\*(.+?)\*/g, '$1')          // italic
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/`(.+?)`/g, '$1')            // inline code
    .replace(/```[\s\S]*?```/g, '')       // code blocks
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')  // links
    .replace(/^[-*+]\s+/gm, '')           // list markers
    .replace(/^\d+\.\s+/gm, '')          // ordered list
    .replace(/^>\s+/gm, '')              // blockquotes
    .replace(/---+/g, '')               // horizontal rules
    .replace(/\n{3,}/g, '\n\n')         // multiple newlines
    .trim();
}

/**
 * Get document title from first H1 in raw content.
 */
function getDocTitle(content) {
  const match = content.match(/^#\s+(.+)/m);
  return match ? match[1].trim() : 'Untitled Document';
}

// ─────────────────────────────────────────────────────
//  HOME SCREEN
// ─────────────────────────────────────────────────────

function initHome() {
  renderMaterialsList();
  loadHomeStats();
  loadLastSession();
  showScreen('home');
}

function renderMaterialsList() {
  DOM.materialsList.innerHTML = '';
  MATERIALS.forEach(mat => {
    const btn = document.createElement('button');
    btn.className = 'material-item';
    btn.setAttribute('tabindex', '0');
    btn.innerHTML = `
      <span class="material-icon">${mat.icon}</span>
      <span class="material-info">
        <span class="material-name">${mat.name}</span>
        <span class="material-desc">${mat.desc}</span>
      </span>
      <svg class="material-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
      </svg>
    `;
    btn.addEventListener('click', () => loadBuiltinMaterial(mat));
    DOM.materialsList.appendChild(btn);
  });
}

async function loadBuiltinMaterial(mat) {
  try {
    const resp = await fetch(mat.file);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const content = await resp.text();
    openDocument(mat.name, content);
  } catch (err) {
    showToast(`Could not load "${mat.name}" — check materials/ folder`);
    console.error(err);
  }
}

function openDocument(name, content) {
  if (!content || content.trim().length < 10) {
    showToast('File appears to be empty or too short.');
    return;
  }

  const sections = parseMarkdown(content);
  if (sections.length === 0) {
    showToast('No sections found. Add headings (# Title) to your markdown.');
    return;
  }

  State.currentFile = { name, content };
  State.sections = sections;

  // Save to localStorage
  LS.set('lastFile', { name, content });

  showPicker();
}

// ─────────────────────────────────────────────────────
//  FILE UPLOAD
// ─────────────────────────────────────────────────────

function initUpload() {
  DOM.fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  });

  DOM.uploadZone.addEventListener('dragover', e => {
    e.preventDefault();
    DOM.uploadZone.classList.add('drag-over');
  });

  DOM.uploadZone.addEventListener('dragleave', () => {
    DOM.uploadZone.classList.remove('drag-over');
  });

  DOM.uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    DOM.uploadZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });
}

function handleFile(file) {
  if (!file.name.match(/\.(md|txt)$/i)) {
    showToast('Please upload a .md or .txt file');
    return;
  }

  const reader = new FileReader();
  reader.onload = e => openDocument(file.name.replace(/\.[^.]+$/, ''), e.target.result);
  reader.onerror = () => showToast('Failed to read file.');
  reader.readAsText(file);
}

// ─────────────────────────────────────────────────────
//  PICKER SCREEN
// ─────────────────────────────────────────────────────

function showPicker() {
  const { name, content } = State.currentFile;
  const sections = State.sections;

  DOM.pickerFilename.textContent = name;
  DOM.pickerDocTitle.textContent = getDocTitle(content);

  const totalChars = sections.reduce((s, sec) => s + sec.rawText.length, 0);
  DOM.pickerDocMeta.textContent =
    `${sections.length} sections · ~${Math.ceil(totalChars / 5)} words`;

  // Render TOC
  DOM.tocList.innerHTML = '';
  sections.forEach((sec, i) => {
    const btn = document.createElement('button');
    btn.className = `toc-item level-${sec.level}`;

    const preview = sec.rawText.replace(/\n/g, ' ').slice(0, 80).trim();
    const chars = sec.rawText.length;
    const estMin = (chars / (250 * 5)).toFixed(1);

    btn.innerHTML = `
      <span class="toc-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="toc-info">
        <span class="toc-title">${escapeHTML(sec.title)}</span>
        <span class="toc-preview">${escapeHTML(preview)}…</span>
        <span class="toc-chars">${chars.toLocaleString()} chars · ~${estMin} min</span>
      </span>
      <svg class="toc-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
      </svg>
    `;
    btn.addEventListener('click', () => startSession(i));
    DOM.tocList.appendChild(btn);
  });

  showScreen('picker');
}

// ─────────────────────────────────────────────────────
//  TYPING SESSION
// ─────────────────────────────────────────────────────

function startSession(sectionIndex) {
  const section = State.sections[sectionIndex];
  if (!section) { showToast('Section not found'); return; }

  State.currentSection = sectionIndex;

  // Clean up target text
  const raw = section.rawText;
  State.targetText = raw.replace(/\n{3,}/g, '\n\n').trim();

  // Reset state
  State.currentIndex  = 0;
  State.totalErrors   = 0;
  State.extraChars    = 0;
  State.inputHistory  = [];
  State.startTime     = null;
  State.elapsedSeconds= 0;
  State.isPaused      = false;
  State.isFinished    = false;

  clearInterval(State.timerInterval);
  clearTimeout(State.idleTimeout);

  // Save last session
  LS.set('lastSession', {
    file: State.currentFile.name,
    section: section.title,
    sectionIndex,
  });

  // Render
  DOM.sectionLabel.textContent = `${State.currentFile.name} → ${section.title}`;
  renderDisplayText();
  resetHUD();

  // Clear input
  DOM.typingInput.value = '';

  showScreen('typing');

  // Focus input after brief delay (allow screen transition)
  setTimeout(() => {
    DOM.typingInput.focus();
    showHint();
  }, 350);
}

// ─────────────────────────────────────────────────────
//  DISPLAY TEXT RENDERING
// ─────────────────────────────────────────────────────

function renderDisplayText() {
  const target = State.targetText;
  DOM.displayText.innerHTML = '';

  // Create a span per character
  for (let i = 0; i < target.length; i++) {
    const ch = target[i];

    if (ch === '\n') {
      // Render newlines as visible breaks
      const br = document.createElement('span');
      br.className = 'char para-break';
      br.dataset.index = i;
      br.innerHTML = '<br>';
      DOM.displayText.appendChild(br);
    } else {
      const span = document.createElement('span');
      span.className = 'char';
      span.dataset.index = i;
      span.textContent = ch;
      DOM.displayText.appendChild(span);
    }
  }

  // Cursor element
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cursor.id = 'typing-cursor';
  DOM.displayText.appendChild(cursor);

  moveCursor(0);
}

/**
 * Get all char spans (excludes cursor).
 */
function getCharSpans() {
  return DOM.displayText.querySelectorAll('.char');
}

/**
 * Update visual state of all typed characters.
 */
function updateDisplay() {
  const spans = getCharSpans();
  const history = State.inputHistory;
  const target  = State.targetText;

  for (let i = 0; i < spans.length; i++) {
    const span = spans[i];
    if (target[i] === '\n') continue; // skip break spans

    if (i < history.length) {
      if (history[i] === target[i]) {
        span.className = 'char correct';
      } else {
        span.className = 'char incorrect';
      }
    } else if (i === State.currentIndex) {
      span.className = 'char current';
    } else {
      span.className = 'char';
    }
  }

  moveCursor(State.currentIndex);
}

/**
 * Move the cursor beam to the character at `index`.
 */
function moveCursor(index) {
  const cursor = $('typing-cursor');
  if (!cursor) return;

  const spans = getCharSpans();
  const target = spans[index] || spans[spans.length - 1];
  if (!target) return;

  const containerRect = DOM.displayText.getBoundingClientRect();
  const targetRect    = target.getBoundingClientRect();

  cursor.style.left = `${targetRect.left - containerRect.left}px`;
  cursor.style.top  = `${targetRect.top - containerRect.top}px`;
  cursor.style.height = `${targetRect.height || 20}px`;
}

// ─────────────────────────────────────────────────────
//  TYPING ENGINE
// ─────────────────────────────────────────────────────

function handleKeyInput(e) {
  if (State.isFinished) return;

  // Pause on Escape
  if (e.key === 'Escape') {
    togglePause();
    return;
  }

  // Restart on Tab
  if (e.key === 'Tab') {
    e.preventDefault();
    restartSession();
    return;
  }

  if (State.isPaused) return;
}

/**
 * Core typing logic — runs on every `input` event from the textarea.
 * We track the full textarea value against targetText character by character.
 */
function handleInput(e) {
  if (State.isFinished || State.isPaused) {
    DOM.typingInput.value = '';
    return;
  }

  const inputVal = DOM.typingInput.value;

  // Start timer on first char
  if (!State.startTime && inputVal.length > 0) {
    startTimer();
  }

  // Reset idle timeout
  clearTimeout(State.idleTimeout);
  State.idleTimeout = setTimeout(() => {
    if (!State.isFinished) pauseTimer();
  }, 5000);

  // Mark cursor as typing (stop blink)
  const cursor = $('typing-cursor');
  if (cursor) {
    cursor.classList.add('typing');
    clearTimeout(cursor._blinkTimeout);
    cursor._blinkTimeout = setTimeout(() => cursor.classList.remove('typing'), 800);
  }

  // Build inputHistory from current textarea value
  // We compare textarea value length vs target
  const newHistory = [];
  for (let i = 0; i < inputVal.length; i++) {
    newHistory.push(inputVal[i]);
  }

  State.inputHistory = newHistory;
  State.currentIndex = newHistory.length;

  // Count errors in current history
  let errors = 0;
  for (let i = 0; i < newHistory.length; i++) {
    if (i < State.targetText.length && newHistory[i] !== State.targetText[i]) {
      errors++;
    }
  }
  State.totalErrors = errors;

  updateDisplay();
  updateHUD();

  // Auto-scroll to keep cursor visible
  scrollToCursor();

  // Check completion
  if (State.currentIndex >= State.targetText.length) {
    finishSession();
  }
}

/**
 * Scroll so the cursor is in the middle of the viewport.
 */
function scrollToCursor() {
  const cursor = $('typing-cursor');
  if (!cursor) return;

  const rect = cursor.getBoundingClientRect();
  const vh   = window.innerHeight;

  if (rect.top < vh * 0.3 || rect.top > vh * 0.65) {
    cursor.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}

// ─────────────────────────────────────────────────────
//  TIMER
// ─────────────────────────────────────────────────────

function startTimer() {
  State.startTime = Date.now() - State.elapsedSeconds * 1000;
  clearInterval(State.timerInterval);
  State.timerInterval = setInterval(() => {
    State.elapsedSeconds = (Date.now() - State.startTime) / 1000;
    updateTimerDisplay();
    updateWPM();
  }, 250);
}

function pauseTimer() {
  if (!State.startTime || State.isPaused) return;
  clearInterval(State.timerInterval);
  State.isPaused = true;
  showPauseOverlay(true);
}

function resumeTimer() {
  if (!State.isPaused) return;
  State.startTime = Date.now() - State.elapsedSeconds * 1000;
  State.isPaused  = false;
  showPauseOverlay(false);
  startTimer();
  DOM.typingInput.focus();
}

function togglePause() {
  if (State.isPaused) resumeTimer();
  else pauseTimer();
}

function updateTimerDisplay() {
  const s = Math.floor(State.elapsedSeconds);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  DOM.hudTimer.textContent = `${m}:${String(sec).padStart(2, '0')}`;
}

// ─────────────────────────────────────────────────────
//  HUD / STATS
// ─────────────────────────────────────────────────────

function calcWPM() {
  if (!State.startTime || State.elapsedSeconds < 1) return 0;
  const correctChars = State.inputHistory.filter(
    (ch, i) => ch === State.targetText[i]
  ).length;
  const minutes = State.elapsedSeconds / 60;
  return Math.round((correctChars / 5) / minutes);
}

function calcAccuracy() {
  const total = State.inputHistory.length;
  if (total === 0) return 100;
  const correct = State.inputHistory.filter(
    (ch, i) => ch === State.targetText[i]
  ).length;
  return Math.round((correct / total) * 100);
}

function calcProgress() {
  const total = State.targetText.length;
  if (total === 0) return 0;
  return Math.round((State.currentIndex / total) * 100);
}

function updateWPM() {
  DOM.hudWpm.textContent = calcWPM();
}

function updateHUD() {
  const acc  = calcAccuracy();
  const prog = calcProgress();

  DOM.hudAcc.textContent      = `${acc}%`;
  DOM.hudProgress.textContent = `${prog}%`;
  DOM.progressFill.style.width = `${prog}%`;
}

function resetHUD() {
  DOM.hudWpm.textContent      = '0';
  DOM.hudAcc.textContent      = '100%';
  DOM.hudTimer.textContent    = '0:00';
  DOM.hudProgress.textContent = '0%';
  DOM.progressFill.style.width = '0%';
}

// ─────────────────────────────────────────────────────
//  FINISH SESSION
// ─────────────────────────────────────────────────────

function finishSession() {
  State.isFinished = true;
  clearInterval(State.timerInterval);
  clearTimeout(State.idleTimeout);

  const wpm     = calcWPM();
  const acc     = calcAccuracy();
  const elapsed = State.elapsedSeconds;

  // Count correct words
  const targetWords = State.targetText.trim().split(/\s+/);
  const inputWords  = State.inputHistory.join('').trim().split(/\s+/);
  let correctWords  = 0;
  targetWords.forEach((tw, i) => {
    if (inputWords[i] === tw) correctWords++;
  });

  const result = {
    wpm, acc, elapsed,
    typos:    State.totalErrors,
    chars:    State.inputHistory.length,
    correctWords,
    section:  State.sections[State.currentSection]?.title || '',
    file:     State.currentFile?.name || '',
    date:     Date.now(),
  };

  // Save to history
  const history = LS.get('history') || [];
  history.unshift(result);
  LS.set('history', history.slice(0, 50)); // keep last 50

  // Best WPM
  const best = LS.get('bestWPM') || 0;
  if (wpm > best) LS.set('bestWPM', wpm);

  showResults(result);
}

function showResults(r) {
  const m   = Math.floor(r.elapsed / 60);
  const sec = Math.floor(r.elapsed % 60);

  DOM.resultsSectionName.textContent =
    `${r.file} · ${r.section}`;

  DOM.resWpm.textContent   = r.wpm;
  DOM.resAcc.textContent   = `${r.acc}%`;
  DOM.resTime.textContent  = `${m}:${String(sec).padStart(2, '0')}`;
  DOM.resTypos.textContent = r.typos;
  DOM.resChars.textContent = r.chars.toLocaleString();
  DOM.resWords.textContent = r.correctWords;

  // New best badge
  const best = LS.get('bestWPM') || 0;
  const existing = document.querySelector('.new-best-badge');
  if (existing) existing.remove();
  if (r.wpm >= best && r.wpm > 0) {
    const badge = document.createElement('div');
    badge.className = 'new-best-badge';
    badge.textContent = '★ NEW BEST';
    DOM.resWpm.after(badge);
  }

  showScreen('results');
}

// ─────────────────────────────────────────────────────
//  RESTART / NAVIGATION
// ─────────────────────────────────────────────────────

function restartSession() {
  startSession(State.currentSection);
}

function goNextSection() {
  const next = State.currentSection + 1;
  if (next < State.sections.length) {
    startSession(next);
  } else {
    showToast('You finished the last section! 🎉');
    showPicker();
  }
}

// ─────────────────────────────────────────────────────
//  PAUSE OVERLAY
// ─────────────────────────────────────────────────────

function ensurePauseOverlay() {
  if ($('pause-overlay')) return;
  const overlay = document.createElement('div');
  overlay.id    = 'pause-overlay';
  overlay.className = 'pause-overlay';
  overlay.innerHTML = `
    <div class="pause-box">
      <h2>Paused</h2>
      <p>Press <strong>Esc</strong> or click to continue</p>
    </div>
  `;
  overlay.addEventListener('click', () => resumeTimer());
  document.body.appendChild(overlay);
}

function showPauseOverlay(show) {
  ensurePauseOverlay();
  const overlay = $('pause-overlay');
  overlay.classList.toggle('visible', show);
}

// ─────────────────────────────────────────────────────
//  FOCUS MODE
// ─────────────────────────────────────────────────────

function toggleFocusMode() {
  State.focusMode = !State.focusMode;
  DOM.screenTyping.classList.toggle('focus-mode', State.focusMode);
  DOM.btnFocusMode.classList.toggle('active', State.focusMode);
  showToast(State.focusMode ? 'Focus mode ON' : 'Focus mode OFF');
}

// ─────────────────────────────────────────────────────
//  HINTS
// ─────────────────────────────────────────────────────

let hintTimeout;

function showHint() {
  DOM.typingHint.classList.remove('visible');
  clearTimeout(hintTimeout);
  hintTimeout = setTimeout(() => {
    DOM.typingHint.classList.add('visible');
  }, 2000);
}

// ─────────────────────────────────────────────────────
//  LOCAL STORAGE HELPER
// ─────────────────────────────────────────────────────

const LS = {
  set(key, val) {
    try { localStorage.setItem(`marktype_${key}`, JSON.stringify(val)); } catch {}
  },
  get(key) {
    try { return JSON.parse(localStorage.getItem(`marktype_${key}`)); } catch { return null; }
  },
};

// ─────────────────────────────────────────────────────
//  HOME STATS
// ─────────────────────────────────────────────────────

function loadHomeStats() {
  const history = LS.get('history') || [];
  const bestWPM = LS.get('bestWPM') || 0;

  if (history.length > 0) {
    DOM.statsBar.style.display = 'flex';
    DOM.statBestWpm.textContent = bestWPM > 0 ? bestWPM : '—';
    DOM.statSessions.textContent = history.length;
    const avgAcc = Math.round(
      history.slice(0, 10).reduce((s, r) => s + r.acc, 0) / Math.min(history.length, 10)
    );
    DOM.statAvgAcc.textContent = history.length > 0 ? `${avgAcc}%` : '—';
  }
}

function loadLastSession() {
  const last = LS.get('lastSession');
  const lastFile = LS.get('lastFile');
  const history = LS.get('history') || [];

  if (!last || !lastFile || history.length === 0) return;

  DOM.historyCard.style.display = 'block';

  const lastResult = history[0];
  const m   = Math.floor((lastResult?.elapsed || 0) / 60);
  const sec = Math.floor((lastResult?.elapsed || 0) % 60);

  DOM.lastSession.innerHTML = `
    <div class="session-info">
      <div class="session-title">${escapeHTML(last.section)}</div>
      <div class="session-sub">${escapeHTML(last.file)} · last session</div>
    </div>
    <div class="session-stats">
      <div class="session-stat">
        <span class="val">${lastResult?.wpm || 0}</span>
        <span class="lbl">WPM</span>
      </div>
      <div class="session-stat">
        <span class="val">${lastResult?.acc || 0}%</span>
        <span class="lbl">Acc</span>
      </div>
      <div class="session-stat">
        <span class="val">${m}:${String(sec).padStart(2,'0')}</span>
        <span class="lbl">Time</span>
      </div>
    </div>
    <button class="btn-continue" id="btn-continue">Continue →</button>
  `;

  $('btn-continue').addEventListener('click', () => {
    // Re-open last file and jump to last section
    openDocument(lastFile.name, lastFile.content);
    // After picker loads, auto-start
    setTimeout(() => {
      const idx = last.sectionIndex ?? 0;
      if (State.sections[idx]) startSession(idx);
    }, 100);
  });
}

// ─────────────────────────────────────────────────────
//  TOAST
// ─────────────────────────────────────────────────────

let toastEl = null;
let toastTimeout = null;

function showToast(msg) {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toastEl.classList.remove('show'), 2800);
}

// ─────────────────────────────────────────────────────
//  UTILITIES
// ─────────────────────────────────────────────────────

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─────────────────────────────────────────────────────
//  EVENT LISTENERS
// ─────────────────────────────────────────────────────

function initEventListeners() {
  // Picker back
  DOM.btnBackHome.addEventListener('click', initHome);

  // Exit typing
  DOM.btnExitTyping.addEventListener('click', () => {
    clearInterval(State.timerInterval);
    showPicker();
  });

  // Focus mode
  DOM.btnFocusMode.addEventListener('click', toggleFocusMode);

  // Typing input
  DOM.typingInput.addEventListener('keydown', handleKeyInput);
  DOM.typingInput.addEventListener('input', handleInput);

  // Click display text → focus textarea
  DOM.displayText.addEventListener('click', () => {
    if (!State.isPaused) DOM.typingInput.focus();
    else resumeTimer();
  });

  // Click typing container → focus
  DOM.typingContainer.addEventListener('click', () => {
    if (!State.isPaused && !State.isFinished) DOM.typingInput.focus();
  });

  // Results buttons
  DOM.btnRetry.addEventListener('click', restartSession);
  DOM.btnNextSection.addEventListener('click', goNextSection);
  DOM.btnResultsHome.addEventListener('click', initHome);

  // Window resize → reposition cursor
  window.addEventListener('resize', () => {
    if ($('screen-typing').classList.contains('active')) {
      moveCursor(State.currentIndex);
    }
  });

  // Visibility change → auto-pause
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && State.startTime && !State.isFinished) {
      pauseTimer();
    }
  });
}

// ─────────────────────────────────────────────────────
//  BOOT
// ─────────────────────────────────────────────────────

function init() {
  initUpload();
  initEventListeners();
  initHome();
}

// Wait for marked.js to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
