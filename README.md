<div align="center">
<img width="1200" height="475" alt="ReadmeRouletter" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Readme.txt Rouletter

> Scans the void for "TODO: fix later" and other developer tears. An AI-powered exploration of broken code and deadline panic. 🐛

```
Digital Archaeology Division
"We didn't write the code. We just catalogued its confessions."
```

## What is this?

**Readme.txt Rouletter** is an interactive exhibition dedicated to the uncelebrated literature of software engineering — the *code comment*.

Every line of code is a decision. Every comment is a confession.

Deep within abandoned repos and forgotten forks, developers leave behind traces of their humanity: frustrated rants, confused TODOs, desperate FIXMEs, and cryptic explanations that no longer make sense. This tool acts as a digital archaeologist, scrolling through these hidden messages so you don't have to.

### ⚠️ Disclaimer

All displayed "artifacts" are **AI-generated simulations** of real developer confessions — inspired by patterns observed in open-source codebases. No actual repositories were harmed, inspected, or judged during the making of this app. It's fiction, but the pain is real.

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+

### Run locally

```bash
# 1. Clone the repo
git clone https://github.com/JithendraNara/readme-roulette.git
cd readme-roulette

# 2. Install dependencies
npm install

# 3. (Optional) Set up Firebase for live backend
# Copy and fill in your Firebase config in services/firebase.ts
# See "Backend" section below.

# 4. Start the dev server
npm run dev
```

The app opens at `http://localhost:3000`.

### Build for production

```bash
npm run build
npm run preview
```

Static output goes to `dist/`. Deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, etc.).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 19 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS (PostCSS) |
| Backend | Firebase Functions (Cloud) |
| AI | Google Gemini (AI Studio) |
| Fonts | Georgia / Courier New (system serif/mono) |

### Architecture

```
src/
├── App.tsx              # Root — state, history, scan logic
├── components/
│   ├── ArtifactDisplay  # The "display case" — main quote card
│   ├── Controls         # [Find Another Discovery] button
│   ├── Header           # Branding + Archives/About nav
│   ├── AboutModal       # About the collection modal
│   └── HistoryModal    # Slide-in archives drawer
├── services/
│   ├── gemini.ts        # Fetches artifact from Firebase backend
│   └── firebase.ts      # Firebase Functions init
├── utils/
│   └── regex.ts         # Comment extraction from raw code
├── types.ts             # CodeArtifact, GeminiArtifactResponse
└── constants.ts        # Loading messages, fallback artifacts

.env.local
├── VITE_FIREBASE_API_KEY
├── VITE_FIREBASE_AUTH_DOMAIN
├── VITE_FIREBASE_PROJECT_ID
└── VITE_FIREBASE_APP_ID
```

---

## Backend

The app uses a **Firebase Cloud Function** (`assistant`) as its server-side backend. This protects API keys and keeps Gemini calls server-side.

The backend is **optional** — if Firebase is unreachable, the app falls back to a static set of 15 pre-written artifacts.

### Deploying your own backend

1. Set up a Firebase project with Functions enabled
2. Deploy the `functions/` directory from the AI Studio project
3. Update `services/firebase.ts` with your Firebase config
4. Add your config values to `.env.local` (see `.env.local.example`)

---

## The Aesthetic

The UI is designed as a **museum archive** — stark, dark, reverent.

- **Colors:** `#0a0a0a` museum black, `#f2eecb` aged paper, `#2d2d2d` museum ink
- **Typography:** Georgia serif for artifact quotes, Courier New monospace for metadata
- **Animation:** Slow scan-line sweep, gentle fade-ins, mouse-tracking spotlight
- **Mood tones:** Artifacts are tagged with one of: `frustrated`, `confused`, `angry`, `funny`, `defeated`

> *"Every line of code is a decision, but every comment is a confession."*

---

## Related

- [NousResearch/Hermes-Agent](https://github.com/NousResearch/Hermes-Agent) — AI agent that powers Atlas
- [MiniMax-AI/skills](https://github.com/MiniMax-AI/skills) — Skills library for Claude, Cursor, Codex, OpenCode

---

<div align="center">

**Est. 2025 · Digital Archaeology Division**

Curated by [Jithsss](https://github.com/JithendraNara)

</div>
