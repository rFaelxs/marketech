---
name: marketech-design
description: Use this skill to generate well-branded interfaces and assets for Marketech (e-commerce de mercado com perfis Cliente, Operador e Administrador), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

# Marketech Design Skill

Read the `README.md` file within this skill, and explore the other available files.

## What's here
- `README.md` — brand overview, content fundamentals, visual foundations, iconography
- `colors_and_type.css` — design tokens (colors, type, spacing, radii, shadows, motion)
- `assets/` — logo (light, dark, mark)
- `preview/` — design system cards (rendered as DS preview)
- `ui_kits/cliente/`, `ui_kits/operador/`, `ui_kits/admin/` — per-role UI references with JSX components
- `Marketech.html` — single-file interactive prototype showcasing all three flows

## How to use

**If creating visual artifacts** (slides, mocks, throwaway prototypes, etc):
1. Copy `colors_and_type.css` and `assets/logo*.svg` into your output folder.
2. Import the CSS so all tokens (`--primary-500`, `--font-sans`, `--radius-md`, etc.) are available.
3. Load Lucide via CDN for icons (`https://unpkg.com/lucide@latest/dist/umd/lucide.min.js`) — never inline custom SVG icons.
4. Build static HTML files using the component patterns documented in `preview/` and `ui_kits/`.

**If working on production code**:
1. Read `README.md` (full visual + content fundamentals).
2. Lift token names from `colors_and_type.css` into your stack (CSS vars work everywhere; for Tailwind, mirror them into `theme.extend.colors`).
3. Use `ui_kits/*/Components.jsx` as the reference shape for buttons, product cards, KPI cards, kanban cards, etc.
4. Follow the copy rules in README's **CONTENT FUNDAMENTALS** section — PT-BR sentence case, Title Case in buttons, no emoji, monoespaçado em preços/EAN.

**If user invokes this skill without other guidance**:
Ask them what they want to build or design (which role's screens? a marketing page? an internal dashboard?), ask a few questions about scope and audience, then act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Key constants to remember
- Primary: `#2563EB` (Marketech Blue)
- Accent fresh: `#16A34A` (Verde Mercado) — sucesso / estoque OK / Entregue
- Test e-mails: `cliente@test.com` (→ Catálogo), `operador@test.com` (→ Fila), `admin@test.com` (→ Dashboard)
- Cupom de teste: `PROMO10` (10% off)
- Status de pedido (ordem): Confirmado → Separando → Em Transporte → Entregue
- Tipografia: Manrope (UI), JetBrains Mono (preços / EAN / IDs)
