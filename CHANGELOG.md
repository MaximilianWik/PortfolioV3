# Changelog

## [1.13.0] - 2026-06-17

### Brainfuck visualizer + Konami easter egg

New section — VII. The Arcane Tongue:
- `BrainfuckEngine.ts`: pure TS Brainfuck interpreter. Compiles source to a
  `BFProgram` (bracket map precomputed), then `runBF()` returns a full
  `BFSnapshot[]` — one entry per step — capped at 20 000 steps.
- `BrainfuckVisualizer.tsx`: interactive tape visualizer. Shows the cleaned
  source with the current instruction lit in ember-blood, a 16-cell sliding
  tape window (index + value + ASCII glyph per cell), accumulated output in
  gilt, and RUN / PAUSE / STEP / RESET controls with four speed presets
  (SLOW 200 ms → OVERDRIVE 4 ms). Custom code textarea also included.
  Exposes `lockedCode` + `autoPlay` props for use in the Konami overlay.
- `BrainfuckSection/index.tsx`: lazy-loaded section VII between Relics and
  the Formal Hand. Nav link "VII. The Arcane Tongue" → `#arcane`. Subtle
  hint copy nudges observant visitors toward the easter egg without spoiling it.

New global easter egg — Konami Terminal:
- `KonamiTerminal.tsx`: listens globally for ↑↑↓↓←→←→BA. On match, a
  fullscreen `AnimatePresence` overlay slides in running the "YOU DIED"
  Brainfuck program (`BF_YOU_DIED`) in auto-play mode at 60 ms/step.
  Dismiss with ESC or click-outside.
- `BF_YOU_DIED`: compact loop-based BF that prints `YOU DIED` using three
  tape cells with pointer movement; verified hand-computed.

Navigation:
- Added `#arcane` to `NAV_LINKS` and `SECTION_IDS` (between relics and resume).

## [1.12.0] - 2026-06-17

### Audit pass — fixes, dead-code removal, perf, a11y, new nav feature

New feature — Navigation:
- Scroll-progress ember bar along the nav's lower edge (pure `scaleX` transform).
- Active-chapter highlight: rAF-throttled scroll/resize handler probes live
  section rects (handles lazy-mounted sections) and lights the current link in
  gilt with a shared-layout underline. Mirrored in the mobile menu.

Bugs:
- Stat figures now sourced from a single `STATS` const in `data.ts` — Hero and
  About can no longer disagree (was 14 vs 19 "Systems Tamed").
- Footer "Last Sync" year is computed via a `toRoman()` helper instead of the
  hardcoded `"MMXXVI"`.
- `@keyframes spin` + `gif-float` moved into `index.css` so they survive
  regardless of Tailwind utility scanning (Contact's inline-style `spin` and
  Timeline's float are now guaranteed); removed the runtime-injected `<style>`.
- Favicon: scalable `favicon.svg` is now primary, JPEG kept as legacy fallback.

Dead code / deps:
- Removed `@chenglou/pretext` dependency and the unused `usePretextLayout` hook.
- Dropped unused `experimentalDecorators` / `useDefineForClassFields` from
  tsconfig and the unused `@` path alias from both tsconfig and vite.config.
- Removed the dead Formspree branch in the contact modal (always fell through
  to `mailto:`); simplified `send` to the mail-client hand-off.
- `Bonfire` `Particle.update` dropped its unused `t` param and now uses the RAF
  timestamp instead of a second `Date.now()` call per particle per frame.
- `Timeline` `bgGifs` `useMemo` → module const; About statement lines hoisted
  to module consts.

Performance:
- Visibility-change pause added to `Bonfire` and `RotatingSigil3D` RAF loops.
- `DispersingText` now pauses its per-character loop when off-screen
  (IntersectionObserver) or on a hidden tab.
- `SectionHeading` no longer animates `letterSpacing` (reflow) — static tracking
  + opacity/translate settle.

Accessibility:
- `prefers-reduced-motion` honored across `RevealOnScroll`, `DispersingText`,
  `Bonfire` (static ember frame), `RotatingSigil3D` (static sigil), and
  `SectionHeading`.
- `aria-hidden` on the decorative `CindersOverlay`, `Bonfire`, and `CustomCursor`
  canvases; `RotatingSigil3D` gained `role="button"`, `aria-label`, focus, and
  keyboard activation.
- Semantic `z-cursor` / `z-preloader` utilities replace magic `z-[9999]` /
  `z-[10000]`.

### Design
- DoctrineTab quote restyled from a 2px ember side-stripe to a glyph-led pull
  quote (the only `border-left` exceeding 1px).

## [1.11.0] - 2026-06-17

### Custom flame favicon

- Added `public/favicon.jpeg` — custom favicon image
- Updated `index.html`: `<link rel="icon" type="image/jpeg" href="/favicon.jpeg">` + apple-touch-icon; Vercel serves it directly, no build step needed

## [1.10.0] - 2026-06-16

### Sharon Shakti relic added

- Added Sharon Shakti as relic I in PROJECTS (src/lib/data.ts)
- All previous relics renumbered II–XII
- Repo: github.com/MaximilianWik/Sharon-Shakti · Live: sharon-shakti.vercel.app

## [1.9.0] - 2026-06-09

### The Invocation — full Contact section overhaul

Layout: expanded from max-w-4xl centred column to max-w-6xl two-column grid
(5/12 info panel + 7/12 form).

Left panel:
  Quote (border-left ember-blood, italic bone-dim) · Bonfire animation ·
  Contact links panel with CornerBrackets: each link is a horizontal row
  (sigil icon / sublabel / value / arrow) with hover-fill + x-translate.
  Email, LinkedIn, GitHub with real values from PROFILE. Stockholm location
  with gilt pulse dot. Dark ink-deep/60 bg.

Form (right):
  Rewritten Field component — floating label via JS state (focused/filled),
  animated ember-blood scaleX underline on focus, no peer-based CSS hacks.
  Name + email side-by-side, message textarea (5 rows).
  Submit button uses AnimatedOutline (ember-blood sweep on sending state),
  animated spinner glyph (◈ rotating), Framer Motion color transition on hover.
  Actually functional: builds a mailto: URI from form data and opens the
  user'''s mail client. Notes "opens your mail client / no data stored here".

Three UI states (idle → sending → sent) via AnimatePresence mode:wait.

Success state: centred panel with CornerBrackets in gilt, slow-rotating
  compass sigil in a gilt ring with radial glow, "The Bell Has Rung" heading,
  lore quote, and "Invoke Again" button that resets to idle.

Atmospheric ember-blood radial gradient behind the section.

---

## [1.8.0] - 2026-06-09

### The Bearer — colours, interactive Act III, six projects

Colors:
- "THE BEARER" title changed from bone-white to bone-dim (#9A968B).
- Act II line 1 words: bone-dim. Line 2 words: bone-dim/70.
  "the first time" accent kept in gilt. Less harsh against the dark image.

Act III rework — tabbed interactive panel:
- Left column: portrait image + status panel (unchanged).
- Right column: four-tab panel — Craft · Rites · Doctrine · Forged.
  Active tab has a spring-animated underline via Framer Motion layoutId.
  Tab content switches with AnimatePresence fade + y-slide (mode: wait).
  - Craft: current role (DNB Bank) + thesis (SEB) + skill tags + stat counters.
  - Rites: education timeline (Örebro + Nuremberg) with coursework detail and tags.
  - Doctrine: philosophy quote + full toolkit grid (6 categories).
  - Forged: all six projects as a hover-slide list with tech tags.

Projects expanded to six:
  Added Paleblood Vigil (generative N-body art),
  Studio Panic Attack (R3F 3D immersive web experience),
  Carpet Eater (Python audio-mangling desktop tool, GitHub-only link).

---

## [1.7.0] - 2026-06-09

### The Bearer — Scroll Cinematic (Concept A)

Replaced soul constellation with a three-act sticky scroll cinematic.
Section height is 280vh; the inner container is `position: sticky, top: 0,
height: 100svh`. Framer Motion `useScroll` with `offset: start start / end end`
drives all transforms.

Act I (0.00 – 0.35): blackmaiden.jpg full-bleed, starts blurred + scaled up,
  sharpens as you scroll. "II." fades in, then "THE BEARER" slams up from 80px
  below. Both disappear before Act II arrives. Scroll indicator pulses.

Act II (0.32 – 0.66): image fades back. Opening statement fills the void in two
  lines — large italic serif, centred. Ember-blood divider scaleX-animates
  between them. "the first time" accented in gilt. Lines disappear before Act III.

Act III (0.63 – 1.00): three staggered columns slide in from below —
  portrait + status panel / current role + thesis + education / philosophy +
  side projects + counting stats. Stats triggered via `useMotionValueEvent`
  once scroll passes 0.72.

Removed: soul constellation (SVG/RAF), discipline cards, DisciplineCard,
  project cards, usePretextLayout, AnimatePresence, Sigil.

---

## [1.6.0] - 2026-06-09

### The Bearer — Soul Constellation (full rework)

- Replaced the bio/card layout with an SVG-based orbiting node constellation.
  10 nodes across 3 rings: Inner (gilt, ~50s orbit) — DNB Bank · SEB · Örebro.
  Middle (ember-blood, ~75s) — Agentic AI · Automation · BI & Data · Engineering.
  Outer (bone, ~100s) — Tessera · Cursed Echoes · Subdermal.
- RAF loop updates all SVG element positions, glows, connection-line endpoints,
  and label opacities via direct `setAttribute` calls — zero React re-renders
  per animation frame.
- Mouse movement applies a CSS `perspective` + `rotateX/Y` tilt to the whole
  scene via smooth lerp in the RAF loop. Gives a 3D parallax feel without Three.js.
- Hovering a node pauses its orbit, brightens its glow, and enlarges its circle.
  Clicking opens a Framer Motion slide-in detail panel with title, subtitle,
  body copy, tags, and a project link where applicable. Constellation shifts to
  accommodate the panel. Clicking the same node or Close dismisses it.
- Central orb pulses (radius + stroke-alpha oscillation) via `Math.sin` in the RAF.
- Connection lines from center to each node update each frame; brightness and
  width increase when node is hovered or selected.

---

## [1.5.0] - 2026-06-09

### The Bearer — full section rework

- Replaced the static image + single lore paragraph with a full multi-zone layout.
- **Opening statement**: large typographic block with ember-blood left border and gilt accent. Direct, punchy voice from the LinkedIn bio.
- **Main grid (3/5 + 2/5)**: Left column has current role block (DNB Bank, title, detail text), education (Örebro + Nuremberg), philosophy quote, and stat counters. Right column has the blackmaiden image (simplified — removed Dark Souls quote overlay) and a compact character-sheet status panel (Location, Status, Domain, Focus).
- **Disciplines grid** (4 cards, full-width): Agentic Systems, Automation & Governance, Intelligence & Data, Engineering. Each card has AnimatedOutline + CornerBrackets hover, VanillaTilt 3D, radial glow, skill tags that shift to gilt on hover.
- **Side Projects** (3 cards): Tessera, Cursed Echoes, Subdermal. Each is a clickable `<a>` with AnimatedOutline in ember-blood, hover lift, "VISIT →" indicator, tagline + detail + tech tags.
- Removed DispersingText and usePretextLayout layout-height hack (kept hook for bio height stability only).
- Removed lore-voice bio that obscured real professional info.

---

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
