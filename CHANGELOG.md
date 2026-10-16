# Changelog

All notable changes to `@k79/theme-studio` will be documented in this file.
See detailed long-form engineering reports in [`changelog/`](./changelog).

## [1.0.0] - 2026-10-16

### Added
- **Interactive CLI Setup Wizard**: Run `npx @k79/theme-studio init` for automated framework detection (Next.js 14/15, Vite, React 16-19), CSS variable injection, layout patching, and preset filtering.
- **Component Test Playground**: Exported standalone `<ThemePlayground />` and CLI command `npx @k79/theme-studio demo` for generating instant component testbeds.
- **In-Memory Font Engine**: Substring and category search across 2,103 Fontsource open-source fonts with 0 bytes of persistent storage bloat and <1ms query evaluation.
- **Zero-Flash SSR Hydration**: Dual-layer server style compilation and pre-paint `<ThemeScript />` execution.
- **Micro-Delta Cookie Architecture**: Compresses active custom modifications into compact cookies (<80 bytes) preventing HTTP 431 header bloat.
- **Tactile Neobrutalism Engine**: Mechanical 3D button presses, unblurred offset shadows, and toggleable `data-tactile` physics.
- **Cross-Tab Synchronization**: Real-time theme synchronization across open browser tabs via `BroadcastChannel`.
- **Project-Scoped Storage**: Automatic project key isolation (`k79_theme_<pkg_name>`) to eliminate localhost port collisions.
- **Security Hardening**: Strict CSS value sanitization, script tag XSS escaping, and prototype pollution protection.
