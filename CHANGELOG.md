# Changelog

## [1.4.0] - 2026-06-09

### Chronicle — interactive hover awakening
- Replaced static Timeline entries with a full hover-awakening interaction.
  Hovering a workplace entry: sweeping AnimatedOutline border in gilt, CornerBrackets animate in, year watermark bleeds behind the card as a ghost outline, ember-blood underline draws from the origin edge, role letter-spacing and glow expand, company brightens to gilt, description lifts, skills stagger in. VanillaTilt 3D effect on the card.
- All non-hovered entries dim to 22% opacity and scale to 0.97 — spotlight focus on the active entry.
- Centre sigil marker pulses with a gold box-shadow and scales up on hover.

---

## [1.3.0] - 2026-06-09

### CindersOverlay — realistic ember system

- Full rewrite: replaced dot-particles with a sprite-atlas-based system.
  Pre-rendered streak sprites (radial head + tapered linear tail) — zero per-frame arc/gradient calls.
- Three particle classes: embers (slow rising, cool through 5 heat stages), sparks (fast, brief), ash (dark drifting flecks, normal blend).
- Additive `globalCompositeOperation: lighter` for embers/sparks.
- Per-particle motion params (`windMult`, `turbAmp`, `turbFreq`) for erratic non-uniform drift.
- V-shape life distribution: `lifeMult = 0.18 + 0.82 * distFromCentre` — centre particles barely rise, edge particles travel the full viewport height.
- Canvas `zIndex: 1`, opacity 0.68. Removed `bg-ink-void` from `<main>` (body already has it) so the fixed canvas composites correctly.
- Reduced motion short-circuits only when `prefers-reduced-motion` AND `not (any-pointer: fine)` — previously a touch-screen laptop or Windows reduce-motion setting would silently skip the canvas (width=300, height=150 default = never initialised).
- `mix-blend-mode: screen` removed from canvas — it produces transparent output in a fixed-position stacking context.
- DPR clamped to 1.0 (was 1.5). MAX_PARTICLES 320 → 200, density 1/6500 → 1/9000.
- Destination-out fillRect trail replaced with streak sprites (clearRect each frame) — removed the largest per-frame GPU cost.
- Streak-sprite head radius fixed at 3px across all size classes; only tail length varies (52 / 32 / 18 / 8 px) — eliminates the glowing-blob look on large particles.

### Bug fixes
- **CindersOverlay TDZ crash**: `lifeMult` used in `const life = ...` before it was declared; reordered declarations.
- Hero `z-10` grid div was missing `relative` — Tailwind z-index is a no-op on unpositioned elements; text could be covered by canvas.

---

## [1.2.0] - 2026-06-08

### Performance audit

- **`viewport={{ once: true }}`** — all `whileInView` animations across Hero, Timeline, About, Contact, Highlights, HumanityRestored, RevealOnScroll, SectionHeading. Eliminated full Framer re-animation on every scroll reversal.
- **Chronicle GIFs**: removed `blur(3px)` and `contrast(110%)` filters, `mixBlendMode: 'screen'`, and 3-axis keyframe animation (x/rotate). Replaced with single-axis slow y drift. Added `willChange: transform`.
- **Chronicle DispersingText → `<p>`**: 7 concurrent RAF spring-physics loops removed.
- **Hero bonfire `mixBlendMode`**: moved from Framer `animate` (triggers repaint) to inline `style` (plain CSS toggle).
- **CustomCursor**: removed `mix-blend-difference` (full-page composite every pointer-move).
- **Bonfire `Date.now()`**: hoisted from per-particle to once per `animate()` tick.

---

## [1.1.0] - 2026-05-25

### SEO & Favicon improvements

- **favicon.svg** — replaced inline `data:` URI favicon with a hosted `/public/favicon.svg`.
- **apple-touch-icon** — added for iOS home-screen bookmarks.
- **meta title** — added job title keyword.
- **JSON-LD Person schema** — enriched with `jobTitle`, `description`, `image`, LinkedIn.
- **JSON-LD WebSite schema** — added alongside Person schema.
- **OG + Twitter titles** — updated to match new meta title.
