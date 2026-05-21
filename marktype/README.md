# MarkType — Deployment Guide

## Running Locally

### Method 1: VS Code Live Server
1. Install the **Live Server** extension in VS Code
2. Open the project folder
3. Right-click `index.html` → **Open with Live Server**
4. Browser opens at `http://127.0.0.1:5500`

### Method 2: Python HTTP Server
```bash
# Python 3
python3 -m http.server 8080
# Open: http://localhost:8080
```

### Method 3: Node.js serve
```bash
npx serve .
# Open the URL shown in terminal
```

> ⚠️ Do NOT open `index.html` directly via `file://` — the `fetch()` calls for built-in materials require an HTTP server.

---

## Deploying to GitHub Pages

### Step 1: Create a GitHub repository
1. Go to [github.com](https://github.com) and log in
2. Click **New repository**
3. Name it (e.g. `marktype` or `typing-reader`)
4. Set to **Public**
5. Click **Create repository**

### Step 2: Upload files
**Option A — via GitHub web interface:**
1. Open your new repository
2. Click **Add file → Upload files**
3. Drag the entire project folder contents:
   - `index.html`
   - `style.css`
   - `script.js`
   - `materials/` (folder with all `.md` files)
4. Click **Commit changes**

**Option B — via Git CLI:**
```bash
cd project-folder
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository → **Settings**
2. Scroll to **Pages** (left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Choose branch: `main`, folder: `/ (root)`
5. Click **Save**
6. Wait 1–2 minutes, then visit:
   `https://YOUR_USERNAME.github.io/YOUR_REPO/`

---

## Adding Your Own Materials

Place `.md` files inside the `materials/` folder and register them in `script.js`:

```javascript
const MATERIALS = [
  { id: 'myfile', file: 'materials/myfile.md', icon: '📚', name: 'My Material', desc: 'Description' },
  // ... existing entries
];
```

### Markdown Format Tips
- Use `#` for document title (shown in picker header)
- Use `##` and `###` for sections (each becomes a typing exercise)
- Keep paragraphs separated by blank lines
- Plain prose works best — avoid heavy use of bullet points

Example:
```markdown
# My Study Notes

## Chapter 1: Introduction

This is the first section content. Write several
paragraphs of prose here for best results.

## Chapter 2: Core Concepts

Another section with its own content.
```

---

## Project Structure
```
marktype/
├── index.html          ← Main app (single page)
├── style.css           ← All styles
├── script.js           ← All logic
├── materials/
│   ├── marketing.md    ← Built-in material
│   ├── sales.md        ← Built-in material
│   └── psychology.md   ← Built-in material
├── assets/             ← (optional) images/icons
└── README.md           ← This file
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Esc` | Pause / Resume |
| `Tab` | Restart current section |
| Click display | Focus input |

---

## Browser Support
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅