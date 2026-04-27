# ResumeCraft Pro — Frontend

A modern, Enhancv-style resume builder built with **Vite + React + TypeScript + Tailwind CSS**.

This is a frontend-only prototype — all data is persisted in `localStorage`. There is no backend
required to run it.

## Features

- 🧑‍💼 **Authentication (mock)** — email/password and Google sign-in flows backed by `localStorage`.
- 📄 **Multiple resumes** with auto-save, duplicate, delete.
- 🧱 **Structured sections**:
  - Personal Info, Summary, Experience, Education, Skills (1-5 with category),
    Projects, Certifications, Achievements, Custom.
- 🪄 **Live preview** that re-renders on every keystroke.
- 🎨 **4 templates** (Modern · Classic · Creative · Minimal) with a tiny template engine
  (`TemplateRenderer`). Switch templates without losing content.
- 🎛️ **Customization**: accent color, font family, heading style, spacing, font size,
  section visibility toggles.
- 🔁 **Drag & drop section reordering** (`@dnd-kit`).
- ↩️ **Undo / Redo** (Ctrl/Cmd + Z, Ctrl/Cmd + Shift + Z), 50 step history.
- 🖨 **Print-perfect A4 layout** with `@page` styling and a high-quality PDF export
  via `html2canvas` + `jsPDF`.
- 🔗 **Shareable preview link** (`/share/:resumeId`) that reads from local store.
- ⚡ **Auto-save** (debounced 350ms) with visible save status.

## Run

```bash
cd frontend-react
npm install
npm run dev
```

Open http://localhost:5173.

## Build & test

```bash
npm run build    # type-check + production build
npm run preview  # serve the production build
npm run test     # vitest suite (reducer tests)
npm run lint     # eslint
```

## Folder structure

```
src/
  components/
    common/      AppShell, AuthShell, RequireAuth
    editor/      SectionList, SectionEditor, PreviewCanvas, CustomizationPanel, TemplatePicker
      editors/   Per-section editors (Personal, Summary, Experience, ...)
    templates/   Template engine + Modern, Classic, Creative, Minimal
  data/          Mock templates, factory & seed data
  lib/           id, classnames, storage, export (PDF)
  pages/         Landing, Login, Register, Dashboard, Templates, Editor, Share
  store/         AuthContext, EditorContext, editorReducer (+ tests)
  types/         Resume domain model
```

## Notes on stack choice

The product spec preferred Next.js + Tailwind. This editor is heavily client-side (drag/drop,
auto-save, live preview), so I went with **Vite + React + TS + Tailwind** for fast HMR and a
simpler bundle. A Next.js port is straightforward later if you need SSR for marketing pages.
