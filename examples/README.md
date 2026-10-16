# @k79/theme-studio Examples ⚡

This directory contains complete, production-ready runnable applications demonstrating how to integrate **`@k79/theme-studio`** with **Tailwind CSS v4** and modern React frameworks.

---

## Available Examples

### 1. [`examples/nextjs`](./nextjs)
- **Framework**: Next.js 15 (App Router) + React 19
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`)
- **Key Features**:
  - **Zero-Flash SSR Hydration**: Reads `k79_theme_state` compact cookie and injects `<ZenithThemeStyle />` into `<head>` before first paint.
  - **Pre-Hydration Script**: `<ThemeScript />` handles system preference changes before React mounts.
  - **Floating Theme Launcher**: Enabled via `<ThemeProvider studio={{ position: "bottom-right" }}>` with interactive live drawer.
  - **Cross-Tab Sync**: Real-time multi-window theme synchronization.

```bash
cd examples/nextjs
bun install
bun run dev
```

---

### 2. [`examples/react`](./react)
- **Framework**: Vite + React 19 (SPA)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Key Features**:
  - Fast client-side SPA theme state machine.
  - `<ThemeProvider studio={true}>` with floating launcher FAB.
  - Live token inspection and custom delta overrides.

```bash
cd examples/react
bun install
bun run dev
```
