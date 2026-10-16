# Theme Studio Agent Rules

> Minimal token & styling constraints for AI agents generating UI components & custom themes with `@k79/theme-studio`.

## 1. Component Token Reference (Tailwind CSS v4)
Always use these CSS variables / utilities when authoring UI components:

| Element | CSS Variable | Canonical Tailwind v4 Class |
|---|---|---|
| Background Canvas | `--canvas` | `bg-canvas`, `text-canvas` |
| Containers / Panels | `--surface` | `bg-surface` |
| Cards / Dropdowns | `--card` | `bg-card` |
| Borders & Dividers | `--border` | `border-border` |
| Primary Actions | `--primary` | `bg-primary`, `text-primary` |
| Secondary Actions | `--secondary` | `bg-secondary`, `text-secondary` |
| Accent / Highlight | `--accent` | `bg-accent`, `text-accent` |
| Destructive Actions | `--danger` | `bg-danger`, `text-danger` |
| Main Heading / Body | `--text-primary` | `text-text-primary` |
| Muted / Captions | `--text-muted` | `text-text-muted` |
| Radius (Buttons/Inputs) | `--radius` | `rounded-lg` (or `rounded-md`, `rounded-sm`) |
| Radius (Containers) | `--radius-card` | `rounded-card` |
| Dynamic Shadows / Glow | `--shadow` | `style={{ boxShadow: "var(--shadow)" }}` |
| Modal Elevation | `--shadow-lg` | `style={{ boxShadow: "var(--shadow-lg)" }}` |

## 2. Dynamic Elevation & Neon Glow Rule
Tailwind v4 generic classes do NOT automatically pick up dynamic CSS variable shadow changes. For cards and modals to reflect real-time Theme Studio shadow adjustments and Neon Glow, ALWAYS use inline style:
```tsx
style={{ boxShadow: "var(--shadow)" }}
```

## 3. Creating & Registering Custom Themes
When instructed to create custom themes, use `ThemeDefinition` with required baseline `tokens` and optional `lightTokens`:
```tsx
import type { ThemeDefinition } from "@k79/theme-studio";

export const brandTheme: ThemeDefinition = {
  id: "brand-theme",
  name: "Brand Theme",
  tokens: {
    canvas: "#0F0B1E", surface: "#18122B", card: "#21193D", border: "#352A5A",
    primary: "#A855F7", secondary: "#EC4899", accent: "#06B6D4",
    success: "#10B981", danger: "#F43F5E", warning: "#F59E0B",
    textPrimary: "#F8FAFC", textMuted: "#94A3B8", radius: "0.75rem",
    shadow: "0 10px 25px -5px rgba(168, 85, 247, 0.25)", tactile: "false",
  },
  lightTokens: {
    canvas: "#FAF5FF", surface: "#F3E8FF", card: "#FFFFFF", border: "#E9D5FF",
    primary: "#9333EA", secondary: "#DB2777", textPrimary: "#1E1B4B", textMuted: "#6B7280",
  },
};
```
Register with `<ThemeProvider themes={[...defaultPresets, brandTheme]}>`. In Next.js, also pass it to `getSsrThemeState(cookiePayload, allThemes)`.

## 4. Tactile Physics & Theme Customizer
To read tokens, open the studio drawer, or toggle tactile physics in any component:
```tsx
import { useTheme } from "@k79/theme-studio";

export function Header() {
  const { tokens, openStudio, setMode, setCustomTokens, resolvedMode } = useTheme();
  const isTactile = tokens.tactile === "true";

  return (
    <div className="flex items-center gap-2">
      {/* Toggle Tactile Physics */}
      <button onClick={() => setCustomTokens({ tactile: isTactile ? "false" : "true" })}>
        Tactile: {isTactile ? "ON" : "OFF"}
      </button>
      {/* Toggle Light / Dark */}
      <button onClick={() => setMode(resolvedMode === "dark" ? "light" : "dark")}>Mode</button>
      {/* Launch Studio Drawer */}
      <button onClick={openStudio}>Theme Studio</button>
    </div>
  );
}
```

## 5. UI Library Bridges (shadcn, DaisyUI, HeroUI)
To make existing component libraries react to Theme Studio in `globals.css`:
- **shadcn/ui**: Map `--background: var(--canvas);`, `--foreground: var(--text-primary);`, `--card: var(--card);`, `--primary: var(--primary);`, `--muted: var(--surface);`, `--border: var(--border);`, `--radius: var(--radius);`.
- **DaisyUI**: Map `--b1: var(--canvas);`, `--bc: var(--text-primary);`, `--p: var(--primary);`, `--rounded-box: var(--radius-card);`.
- **HeroUI**: Map `--heroui-background: var(--canvas);`, `--heroui-primary: var(--primary);`, `--heroui-radius: var(--radius);`.
All primitives will instantly inherit theme presets and Neobrutalism tactile physics without code refactoring.
