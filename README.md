# @k79/theme-studio ⚡

> The enterprise-grade, zero-flash, **Tailwind CSS v4-first** React theming library.  
> Engineered for **Bun** and bundled with **tsdown** (powered by Rolldown Rust core).

[![Build Tool](https://img.shields.io/badge/Bundler-tsdown%20(Rolldown)-orange.svg)](https://github.com/rolldown/tsdown)
[![Runtime](https://img.shields.io/badge/Runtime-Bun%201.4-black.svg)](https://bun.sh)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-v4%20Native-06b6d4.svg)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org)
[![Zero Flash](https://img.shields.io/badge/FOUC-Zero%20Flash-success.svg)](#zero-flash-ssr-hydration-explained)

---

## Table of Contents

- [Interactive Setup Wizard (CLI)](#interactive-setup-wizard-cli)
- [Custom Themes & Preset Configuration](#custom-themes--preset-configuration)
- [What @k79/theme-studio Provides Under the Hood](#what-k79theme-studio-provides-under-the-hood)
- [AI Agent & LLM Integration Guide](#ai-agent--llm-integration-guide)

- [Features](#features)
- [Why @k79/theme-studio?](#why-@k79/theme-studio)
- [Zero-Flash SSR Hydration Explained](#zero-flash-ssr-hydration-explained)
- [Installation](#installation)
- [Setup Guide](#setup-guide)
  - [1. Tailwind CSS v4 Configuration](#1-configure-tailwind-css-v4-globalscss)
  - [2. Next.js App Router Setup](#2-nextjs-app-router-setup-applayouttsx)
  - [3. Vite / SPA Setup](#3-vite--spa-client-setup-srcmaintsx)
- [Complete Project Example](#complete-project-example)
  - [Theme Switcher & Customizer Component](#interactive-theme-switcher--customizer)
- [Storage Adapters](#storage-adapters)
- [Security & Content Security Policy (CSP)](#security--content-security-policy-csp)
- [TypeScript API Reference](#typescript-api-reference)
- [Development & Testing with Bun](#development--testing-with-bun)

---

## Features

- ⚡ **Zero Flash of Unstyled Content (FOUC)**: Dual-layer hydration merges SSR server `<style>` with pre-paint `<ThemeScript />`.
- 🎨 **Tailwind CSS v4 Native**: Seamlessly maps tokens to native CSS custom properties for `@theme` directives.
- 🍪 **Compact Cookie Delta Architecture**: Stores preset ID + only active user customizations (<80 bytes) preventing cookie header bloat.
- 🛡️ **Hardened Security**:
  - CSS injection / expression breakout sanitization.
  - Script-tag XSS escaping (`safeJsonSerialize`).
  - Prototype pollution protection on custom overrides.
  - Strict CSP `nonce` support on all inline elements.
  - Google Font family validation and deduplication.
- 🔄 **Cross-Tab Synchronization**: Real-time multi-window sync with `BroadcastChannel` and storage fallback.
- 📦 **Pluggable Storage**: Cookie, LocalStorage, Memory, or Composite dual-mode storage.
- 🧩 **Extensible Plugin System**: Pre-built hooks for analytics, tenant theming, and token transformations.
- 🚀 **Built for Speed**: Packaged with `tsdown` using Rolldown (Rust-based bundler) and native Bun test runner.

---

## Why @k79/theme-studio?

| Challenge in Other Theme Libraries | How `@k79/theme-studio` Solves It |
| :--- | :--- |
| **Theme Flash on Page Load** | Compiles CSS custom properties directly on the server into initial HTML + blocking `<ThemeScript />` executes prior to DOM body parsing. |
| **Cookie Header Bloat (HTTP 431)** | Rather than serializing full 1KB theme objects into cookies, calculates a compact delta diff (`{"id":"nord","m":"dark","d":{"primary":"#ff0077"}}`). |
| **Tailwind v4 Incompatibility** | Doesn't rely on legacy Tailwind JS config plugins. Exposes CSS variables mapped directly to `@theme`. |
| **Cross-Tab Desync** | Employs an event bus with `BroadcastChannel` and `window.storage` fallback to keep open tabs in sync. |
| **CSS & XSS Injection** | Sanitizes all runtime color codes, fonts, and properties against regex white-lists and escapes script payloads. |

---

## Zero-Flash SSR Hydration Explained

When users refresh a page:
1. **Server Phase (SSR)**: The server reads the compact cookie (`k79_theme_state`), looks up the preset tokens, overlays any delta overrides, and renders `<ZenithThemeStyle />` into `<head>`.
2. **Initial Paint (Frame 0)**: The browser parses the CSS before rendering the `<body>`. There is **zero visible jump**.
3. **Client Phase**: `<ThemeScript />` executes safely in `<head>` to detect system media queries and apply fallbacks before React attaches.

---

## Quick Start: Interactive CLI Wizard 🚀

Set up your entire project in seconds with the interactive CLI wizard. It detects your framework, configures Tailwind, injects tokens, wires your layout, and offers an instant component playground:

```bash
# Using Bun (Recommended)
bunx @k79/theme-studio init

# Using npx
npx @k79/theme-studio init

# Using pnpm
pnpm dlx @k79/theme-studio init
```

### Interactive Playground Command
Want to test your theme tokens, shadows, tactile physics, and form controls without writing test code?
```bash
# Generate an interactive component playground page
npx @k79/theme-studio demo
# or
npx @k79/theme-studio playground
```
This creates an interactive demo page (`app/theme-studio-demo/page.tsx` in Next.js or `src/ThemeStudioDemo.tsx` in Vite/React) with buttons, cards, dialogs, form controls, and live preset switchers.

### What the Interactive CLI Does:
1. **Framework Detection & Confirmation**: Automatically detects whether you are using **Next.js (App Router)**, **Next.js (Pages Router)**, **Vite**, or generic **React**.
2. **Setup Mode Selection**:
   - **Automated Setup**: Automatically installs dependencies and configures your stylesheet with Tailwind v4 variables and tactile physics.
   - **Guided Manual Setup**: Prints tailored, copy-paste code snippets for your exact framework.
3. **Stylesheet Configuration**: Detects existing CSS files (globals.css, index.css) and injects the complete token system and neobrutalism physics without overwriting custom styles.

---

## Installation

```bash
# Using Bun (Recommended)
bun add @k79/theme-studio

# Using pnpm
pnpm add @k79/theme-studio

# Using npm
npm install @k79/theme-studio
```

---

## Setup Guide

### 1. Configure Tailwind CSS v4 (`globals.css`)

In your global CSS file, import Tailwind v4, define `@custom-variant dark`, and link `@theme` to the CSS custom properties generated by `@k79/theme-studio`:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

:root {
	--canvas: #0b0f17;
	--surface: #111827;
	--card: #162032;
	--border: #1e293b;
	--primary: #38bdf8;
	--secondary: #818cf8;
	--accent: #34d399;
	--success: #10b981;
	--danger: #ef4444;
	--warning: #f59e0b;
	--text-primary: #f8fafc;
	--text-muted: #94a3b8;
	--radius: 0.625rem;
	--radius-card: 0.625rem;
	--shadow:
		0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3);
	--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
	--shadow-lg:
		0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
	--font-heading: "Space Grotesk", system-ui, sans-serif;
	--font-body: "Inter", system-ui, sans-serif;
}

@theme {
	--color-canvas: var(--canvas);
	--color-surface: var(--surface);
	--color-card: var(--card);
	--color-border: var(--border);
	--color-primary: var(--primary);
	--color-secondary: var(--secondary);
	--color-accent: var(--accent);
	--color-success: var(--success);
	--color-danger: var(--danger);
	--color-warning: var(--warning);
	--color-text-primary: var(--text-primary);
	--color-text-muted: var(--text-muted);

	--shadow: var(--shadow);
	--shadow-sm: var(--shadow-sm);
	--shadow-lg: var(--shadow-lg);

	--radius: var(--radius);
	--radius-card: var(--radius-card);
	--radius-xs: calc(var(--radius) * 0.25);
	--radius-sm: calc(var(--radius) * 0.5);
	--radius-md: calc(var(--radius) * 0.75);
	--radius-lg: var(--radius);
	--radius-xl: calc(var(--radius) * 1.25);
	--radius-2xl: calc(var(--radius) * 1.5);
	--radius-3xl: calc(var(--radius) * 2);

	--font-heading: var(--font-heading);
	--font-body: var(--font-body);
}

/* Smooth global transitions across all theme components (disabled during initial load to prevent hydration flash) */
html:not(.no-transitions) *,
html:not(.no-transitions) *::before,
html:not(.no-transitions) *::after {
	transition-property:
		background-color, border-color, color, fill, stroke, box-shadow,
		border-radius;
	transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
	transition-duration: 200ms;
}

html.no-transitions *,
html.no-transitions [data-tactile="true"] button,
html.no-transitions [data-tactile="true"] [role="button"],
html.no-transitions [data-tactile="true"] .tactile-item {
	transition: none !important;
}

/* Tactile Neobrutalism on-hover and active physics */
[data-tactile="true"] button:not(:disabled),
[data-tactile="true"] [role="button"],
[data-tactile="true"] .tactile-item {
	box-shadow: 4px 4px 0px 0px #000000 !important;
	border-color: #000000 !important;
	transition:
		transform 120ms cubic-bezier(0.16, 1, 0.3, 1),
		box-shadow 120ms cubic-bezier(0.16, 1, 0.3, 1) !important;
}

[data-tactile="true"] button:not(:disabled):hover,
[data-tactile="true"] [role="button"]:hover,
[data-tactile="true"] .tactile-item:hover {
	transform: translate(2px, 2px);
	box-shadow: 2px 2px 0px 0px #000000 !important;
}

[data-tactile="true"] button:not(:disabled):active,
[data-tactile="true"] [role="button"]:active,
[data-tactile="true"] .tactile-item:active {
	transform: translate(4px, 4px) !important;
	box-shadow: 0px 0px 0px 0px #000000 !important;
}

body {
	background-color: var(--canvas);
	color: var(--text-primary);
	font-family: var(--font-body, system-ui, -apple-system, sans-serif);
	margin: 0;
	min-height: 100vh;
}

h1,
h2,
h3,
h4,
h5,
h6 {
	font-family: var(--font-heading, var(--font-body, inherit));
}
```

---

### 2. Next.js App Router Setup (`app/layout.tsx`)

```tsx
import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  ThemeProvider,
  ThemeScript,
  parseThemeCookie,
  getSsrThemeState,
  ZenithThemeStyle,
  defaultPresets,
} from "@k79/theme-studio";
import "./globals.css";

export const metadata: Metadata = {
  title: "My App",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get("k79_theme_state")?.value;

  // 1. Parse cookie & resolve server-side theme state
  const cookiePayload = parseThemeCookie(rawCookie);
  const ssrState = getSsrThemeState(cookiePayload, defaultPresets);

  return (
    <html
      lang="en"
      className={ssrState.resolvedMode}
      suppressHydrationWarning
    >
      <head>
        {/* 2. Zero-flash SSR styles injected directly into stream */}
        <ZenithThemeStyle themeState={ssrState} />
        {/* 3. Pre-hydration script for client-side resolution */}
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider
          themes={defaultPresets}
          initialState={{
            themeId: ssrState.themeId,
            mode: ssrState.mode,
            delta: ssrState.delta,
          }}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

### 3. Vite / SPA Client Setup (`src/main.tsx`)

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, ThemeScript, defaultPresets } from "@k79/theme-studio";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeScript />
    <ThemeProvider themes={defaultPresets} defaultTheme="dark-slate">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

---

## Complete Project Example

### Interactive Theme Switcher & Customizer

```tsx
"use client";

import React from "react";
import { useTheme } from "@k79/theme-studio";

export function ThemeStudioDrawer() {
  const {
    theme,
    mode,
    resolvedMode,
    themes,
    tokens,
    hasCustomizations,
    setTheme,
    setMode,
    setCustomTokens,
    resetTheme,
  } = useTheme();

  return (
    <div className="p-6 rounded-lg bg-(--color-surface) border border-(--color-border) max-w-md space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-(--color-text-primary)">
          Theme Studio
        </h3>
        <span className="text-xs px-2 py-1 rounded bg-(--color-card) text-(--color-text-muted)">
          Mode: {resolvedMode}
        </span>
      </div>

      {/* Preset Selector */}
      <div className="space-y-1">
        <label className="text-xs text-(--color-text-muted)">Preset Theme</label>
        <div className="grid grid-cols-2 gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`px-3 py-2 text-sm rounded-sm border transition-all text-left ${
                theme === t.id
                  ? "border-(--color-primary) bg-(--color-card) shadow-sm"
                  : "border-(--color-border) hover:border-(--color-text-muted)"
              }`}
            >
              <div className="font-medium text-(--color-text-primary)">{t.name}</div>
              <div className="text-xs text-(--color-text-muted) line-clamp-1">
                {t.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mode Toggles */}
      <div className="space-y-1">
        <label className="text-xs text-(--color-text-muted)">Color Mode</label>
        <div className="flex gap-2">
          {(["light", "dark", "system"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-1.5 text-xs font-medium capitalize rounded-sm border ${
                mode === m
                  ? "bg-(--color-primary) text-white border-(--color-primary)"
                  : "bg-(--color-card) text-(--color-text-primary) border-(--color-border)"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Live Custom Token Override */}
      <div className="space-y-1 pt-2 border-t border-(--color-border)">
        <label className="text-xs text-(--color-text-muted)">Live Primary Accent</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={tokens.primary}
            onChange={(e) => setCustomTokens({ primary: e.target.value })}
            className="w-10 h-10 rounded border border-(--color-border) cursor-pointer"
          />
          <div className="text-xs font-mono text-(--color-text-muted)">
            {tokens.primary}
          </div>
          {hasCustomizations && (
            <button
              onClick={resetTheme}
              className="ml-auto text-xs text-rose-400 hover:underline"
            >
              Reset to Preset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## Storage Adapters

`@k79/theme-studio` provides modular storage strategies:

```typescript
import {
  createCookieStorage,
  createLocalStorage,
  createCompositeStorage,
} from "@k79/theme-studio";

// 1. Cookie Storage (SSR default)
const cookieStorage = createCookieStorage({
  path: "/",
  maxAge: 31536000,
  sameSite: "Lax",
});

// 2. Composite Storage (Fast offline LocalStorage + Cookie SSR sync)
const compositeStorage = createCompositeStorage();

<ThemeProvider storage={compositeStorage}>
  <App />
</ThemeProvider>
```

---

## Security & Content Security Policy (CSP)

`@k79/theme-studio` is hardened against web injection vectors:
1. **CSS Breakout Sanitization**: Every token is validated via `sanitizeCssValue()` before entering CSSOM to prevent CSS attribute exfiltration attacks.
2. **XSS Protection**: Inline `<ThemeScript />` variables are JSON-encoded with characters `<` and `>` replaced with Unicode escape sequences (`\u003c`, `\u003e`).
3. **CSP Nonce**: Pass your CSP nonce directly to `<ThemeScript nonce={cspNonce} />` and `<ZenithThemeStyle nonce={cspNonce} />`.
4. **Prototype Pollution**: Merging custom overrides safely strips `__proto__`, `constructor`, and `prototype`.

---

---

## Custom Themes & Preset Configuration

You can easily register brand-new custom themes or extend the built-in presets by passing them into `<ThemeProvider themes={[...]}>` (and to SSR helper `getSsrThemeState(cookiePayload, customThemes)`).

### 1. Defining a Custom Theme (`ThemeDefinition`)

Every theme is defined using the typed `ThemeDefinition` structure. You can supply a baseline `tokens` object and optional `darkTokens` or `lightTokens` for mode switching:

```tsx
import type { ThemeDefinition } from "@k79/theme-studio";

export const midnightPurpleTheme: ThemeDefinition = {
  id: "midnight-purple",
  name: "Midnight Purple",
  description: "Deep violet canvas with vibrant electric neon accents",
  tokens: {
    // Default / Dark tokens
    canvas: "#0F0B1E",
    surface: "#18122B",
    card: "#21193D",
    border: "#352A5A",
    primary: "#A855F7",
    secondary: "#EC4899",
    accent: "#06B6D4",
    success: "#10B981",
    danger: "#F43F5E",
    warning: "#F59E0B",
    textPrimary: "#F8FAFC",
    textMuted: "#94A3B8",
    radius: "0.75rem",
    // Optional custom typography & shadows
    fontHeading: "'Space Grotesk', system-ui, sans-serif",
    fontBody: "'Inter', system-ui, sans-serif",
    shadow: "0 10px 25px -5px rgba(168, 85, 247, 0.25)",
    tactile: "false", // or "true" to enable Neobrutalist physics by default
  },
  // Optional light-mode palette override for this preset
  lightTokens: {
    canvas: "#FAF5FF",
    surface: "#F3E8FF",
    card: "#FFFFFF",
    border: "#E9D5FF",
    primary: "#9333EA",
    secondary: "#DB2777",
    accent: "#0891B2",
    textPrimary: "#1E1B4B",
    textMuted: "#6B7280",
    shadow: "0 4px 12px rgba(147, 51, 234, 0.12)",
  },
};
```

### 2. Registering Custom Themes with `<ThemeProvider>`

Merge your custom themes with `defaultPresets` and pass them to `<ThemeProvider>`:

```tsx
import { ThemeProvider, defaultPresets } from "@k79/theme-studio";
import { midnightPurpleTheme } from "./themes/midnight-purple";

const allThemes = [...defaultPresets, midnightPurpleTheme];

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      themes={allThemes}
      defaultTheme="midnight-purple"
      defaultMode="dark"
      storageKey="my_app_theme" // Optional custom cookie/localStorage key
      studio={{
        enabled: process.env.NODE_ENV === "development", // Enable drawer in dev
        position: "bottom-right",
      }}
    >
      {children}
    </ThemeProvider>
  );
}
```

### 3. Server-Side SSR Registration (Next.js)

When using custom themes in Next.js App Router, also pass your theme list to `getSsrThemeState` in `app/layout.tsx` so custom themes render with zero flash:

```tsx
import { cookies } from "next/headers";
import { ThemeProvider, ThemeScript } from "@k79/theme-studio";
import { getSsrThemeState, parseThemeCookie, ZenithThemeStyle } from "@k79/theme-studio/server";
import { allThemes } from "./themes";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get("k79_theme_state")?.value;

  // Pass custom themes list as 2nd parameter
  const ssrState = getSsrThemeState(parseThemeCookie(rawCookie), allThemes, "midnight-purple", "dark");

  return (
    <html lang="en" className={ssrState.resolvedMode} data-tactile={ssrState.activeTokens.tactile === "true" ? "true" : undefined} suppressHydrationWarning>
      <head>
        <ZenithThemeStyle themeState={ssrState} />
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider themes={allThemes} initialState={ssrState} studio={{ enabled: true }}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## What @k79/theme-studio Provides Under the Hood

### 1. Zero Flash SSR Without Hydration Mismatch
Traditional React theme switchers suffer from either:
- **White Flash of Death (FOUC)** while client JS initializes.
- **Next.js Hydration Mismatch Warnings** (`Extra attributes from the server: class`).

`@k79/theme-studio` completely eliminates this:
- On the server, `<ZenithThemeStyle />` generates native CSS custom property rules inside `<head>` based on the compact cookie.
- The pre-paint `<ThemeScript />` executes before the HTML `<body>` renders to evaluate `prefers-color-scheme` if set to `"system"`.
- Client hydration attaches seamlessly with zero attribute mismatches and zero page flicker.

### 2. Micro-Delta Cookie Diffing (<80 bytes)
Other libraries serialize the entire theme object into cookies, bloating every subsequent HTTP request and risking HTTP 431 Request Header Fields Too Large.

`@k79/theme-studio` uses an intelligent **delta calculation**:
- If you use preset `"dark-slate"` and customize only the `primary` color, the cookie stores:
  `{"id":"dark-slate","m":"dark","d":{"primary":"#FF0055"}}`
- The cookie payload stays under **80 bytes** while granting unlimited customization.

### 3. Fontsource Live Preview Engine (1,500+ Google Fonts)
The Theme Studio drawer does not bundle font weights or heavy font files:
- Previews in the Typography tab dynamically load stylesheet links from the Fontsource CDN on demand.
- **Active 2-Font Cache**: Only the actively selected heading and body fonts are loaded and cached locally, maintaining zero impact on bundle and load performance.

### 4. Cross-Tab Realtime Broadcast
If a user has multiple tabs open (e.g. settings dashboard and live app), changes made in the Theme Studio drawer are broadcast across tabs using `BroadcastChannel` (falling back to `window.addEventListener("storage")`), synchronizing theme states instantly across windows.

## TypeScript API Reference

### Core Types

```typescript
export interface BaseTokens {
  canvas: string;
  surface: string;
  card: string;
  border: string;
  primary: string;
  secondary: string;
  accent: string;
  textPrimary: string;
  textMuted: string;
  radius: string;
  fontHeading?: string;
  fontBody?: string;
  [key: string]: string | undefined;
}

export interface ThemeDefinition<T extends BaseTokens = BaseTokens> {
  id: string;
  name: string;
  description?: string;
  tokens: T;
  lightTokens?: Partial<T>;
  darkTokens?: Partial<T>;
  metadata?: Record<string, unknown>;
}
```

### Hook: `useTheme<T>()`

```typescript
const {
  theme,               // string (active theme id)
  mode,                // 'light' | 'dark' | 'system'
  resolvedMode,        // 'light' | 'dark'
  tokens,              // Complete active tokens object
  themes,              // ThemeDefinition[]
  hasCustomizations,   // boolean
  setTheme,            // (id: string) => void
  setMode,             // (mode: ColorMode) => void
  setCustomTokens,     // (delta: Partial<T>) => void
  resetTheme,          // () => void
  registerTheme,       // (theme: ThemeDefinition<T>) => void
} = useTheme();
```

---


---

## 🧩 UI Library Compatibility (Zero JS Bridges)

`@k79/theme-studio` coexists and bridges seamlessly with popular UI component libraries. The CLI (`npx @k79/theme-studio init`) automatically detects them and injects the 1-to-1 CSS variable bridges:

### 1. shadcn/ui
```css
/* shadcn/ui <-> @k79/theme-studio Bridge */
:root {
  --background: var(--canvas);
  --foreground: var(--text-primary);
  --card: var(--card);
  --card-foreground: var(--text-primary);
  --popover: var(--surface);
  --popover-foreground: var(--text-primary);
  --primary: var(--primary);
  --primary-foreground: var(--canvas);
  --secondary: var(--surface);
  --secondary-foreground: var(--text-primary);
  --muted: var(--surface);
  --muted-foreground: var(--text-muted);
  --accent: var(--accent);
  --accent-foreground: var(--canvas);
  --destructive: var(--danger);
  --destructive-foreground: #ffffff;
  --border: var(--border);
  --input: var(--border);
  --ring: var(--primary);
  --radius: var(--radius);
}
```

### 2. DaisyUI
```css
/* DaisyUI <-> @k79/theme-studio Bridge */
:root {
  --b1: var(--canvas);
  --b2: var(--surface);
  --b3: var(--card);
  --bc: var(--text-primary);
  --p: var(--primary);
  --s: var(--secondary);
  --a: var(--accent);
  --er: var(--danger);
  --su: var(--success);
  --wa: var(--warning);
  --rounded-box: var(--radius-card);
  --rounded-btn: var(--radius);
}
```

### 3. HeroUI (formerly NextUI)
```css
/* HeroUI <-> @k79/theme-studio Bridge */
:root {
  --heroui-background: var(--canvas);
  --heroui-foreground: var(--text-primary);
  --heroui-primary: var(--primary);
  --heroui-secondary: var(--secondary);
  --heroui-success: var(--success);
  --heroui-warning: var(--warning);
  --heroui-danger: var(--danger);
  --heroui-radius: var(--radius);
}
```

---

## ⚡ Framework & Ecosystem Compatibility

### Tailwind CSS v3 vs Tailwind CSS v4
- **Tailwind v4**: Uses the native `@theme` block generated directly in your CSS.
- **Tailwind v3**: Add our preset extension to `tailwind.config.js`:
  ```js
  // tailwind.config.js (Tailwind v3)
  const { themeStudioTailwindV3Extension } = require("@k79/theme-studio/tailwind");

  module.exports = {
    darkMode: ["class"],
    theme: {
      extend: themeStudioTailwindV3Extension,
    },
  };
  ```

### Migrating from `next-themes`
`@k79/theme-studio` is a complete superset of `next-themes`. It manages `.dark` / `.light` classes on `<html>`, system mode media query listeners, and zero-flash SSR cookie hydration. You can safely replace `import { ThemeProvider } from "next-themes"` with `import { ThemeProvider } from "@k79/theme-studio"`.

### Strict CSP (Content Security Policy) Nonces
Both Server Components and Client Scripts accept a cryptographic `nonce`:
```tsx
import { headers } from "next/headers";

export default async function RootLayout({ children }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html suppressHydrationWarning>
      <head>
        <ZenithThemeStyle themeState={ssrState} nonce={nonce} />
        <ThemeScript nonce={nonce} />
      </head>
      <body>...</body>
    </html>
  );
}
```

### Next.js 14 vs Next.js 15 Async `cookies()`
- **Next.js 15+**: `const cookieStore = await cookies();`
- **Next.js 14 & earlier**: `const cookieStore = cookies();`

### Turborepo & Monorepos
When consuming from an internal workspace package, ensure Next.js transpiles the package:
```js
// next.config.js / next.config.mjs
export default {
  transpilePackages: ["@k79/theme-studio"],
};
```

## Development & Testing with Bun

```bash
# Install dependencies
bun install

# Run tests (Bun native test runner)
bun test

# Build package with tsdown (Rolldown Rust engine)
bun run build

# Watch mode during development
bun run dev

# Type check
bun run typecheck
```

---

## License

MIT © Zenith Theme contributors
