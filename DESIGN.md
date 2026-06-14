# Design

## Theme

Warm dark. The scene: a CS student studying ML late at night on a laptop, lights low, wanting focus and energy without eye strain. A warm charcoal canvas (never pure black, never cool slate) feels intimate and premium, and lets the duotone accents glow like data on a screen.

## Color

Strategy: **duotone, committed.** Two saturated accents carry identity across large surfaces (gradient meshes, glows, strokes). Warm-tinted neutrals everywhere else. No generic SaaS blue, no purple-on-white. All values OKLCH.

### Neutrals (warm, brown-tinted)
- `--bg`: `oklch(0.17 0.012 60)` — warm near-black canvas
- `--surface`: `oklch(0.21 0.014 60)` — cards, panels
- `--surface-2`: `oklch(0.25 0.016 60)` — elevated / hover
- `--border`: `oklch(0.32 0.014 60)` — hairlines, dividers
- `--text`: `oklch(0.96 0.008 70)` — warm off-white, primary
- `--text-muted`: `oklch(0.74 0.012 70)` — secondary
- `--text-faint`: `oklch(0.55 0.012 70)` — captions, hints

### Accents (the duotone)
- `--coral` (primary / warm): `oklch(0.72 0.17 35)` — persimmon-coral, CTAs, energy
- `--coral-strong`: `oklch(0.66 0.19 32)` — coral hover/active
- `--violet` (secondary / cool): `oklch(0.64 0.19 288)` — electric violet, gradient partner, highlights
- `--violet-strong`: `oklch(0.58 0.21 286)` — violet hover/active

### Status
- success `oklch(0.74 0.15 150)` · warning `oklch(0.80 0.15 75)` · error `oklch(0.64 0.20 25)`

### Usage
- Duotone gradient (`--coral` → `--violet`) for hero glow meshes, animated viz strokes, focus rings. Used as background atmosphere and on key strokes, NOT as `background-clip: text` on copy (banned).
- Primary CTA: solid `--coral` with near-black text for punch. Secondary: bordered, transparent.
- Never rely on color alone in visualizations: pair with labels/shape (WCAG AA).

## Typography

No Inter, Roboto, Arial, or Space Grotesk. Characterful display + clean body + mono for the CS/data flavor.

- **Display (headlines, hero):** `Bricolage Grotesque` — distinctive, slightly condensed, high-personality grotesque. Weights 600–800, tight tracking (-0.02em to -0.03em).
- **Body / UI:** `Hanken Grotesk` — warm, highly legible, neutral-but-not-generic. Weights 400/500/600.
- **Mono (code, data labels, equation chips):** `JetBrains Mono` — signals the technical audience, used for metrics, axis labels, code snippets.

Scale: perfect-fourth-ish, fluid with `clamp()`. Body 16px min, line-height 1.5, line length 65–75ch. Headlines use scale + weight contrast (ratio ≥1.25).

## Motion

Framer Motion. Energetic but physics-honest. Ease-out exponential curves (no bounce, no elastic). Scroll-triggered reveals (staggered, 40–80ms stagger), parallax depth on hero, hover lifts (translate + shadow, 150–250ms), animated ML visualizations that loop slowly. Never animate layout properties — use transform/opacity. Honor `prefers-reduced-motion`: replace big motion with gentle fades or static states.

## Layout & Effects

- Grid/flex with `gap`; vary spacing for rhythm (4px base: 8/12/16/24/32/48/64/96). No uniform padding everywhere.
- Cards only when they're the right affordance; never nested cards; avoid identical icon-heading-text grids (asymmetry, varied sizes, editorial breaks instead).
- Atmosphere over flatness: subtle grain/noise overlay, dramatic soft shadows, gradient meshes, glow. No glassmorphism, no Apple mimicry.
- Generous negative space; one clear focal path per section guiding toward conversion.

## Elevation

Soft, warm-tinted shadows (tint toward `--bg` hue, not pure black). Three steps: subtle (cards), medium (hover lift), dramatic (modals/floating focal elements + accent-colored glow on key CTAs).
