# Maximilian Wikström — Portfolio

A dark-fantasy-formal personal portfolio. Hand-crafted with React, Vite,
Tailwind CSS v4, and [motion](https://motion.dev/). The visual language is
deliberately theatrical — ember-blood accents on ink-void, ceremonial
typography (Cormorant Garamond / Cinzel / EB Garamond / JetBrains Mono),
and a bonfire-lit hero.

## Stack

- **React 19** + **TypeScript**
- **Vite 6** (dev server & bundler)
- **Tailwind CSS 4** via `@tailwindcss/vite`
- **motion/react** for declarative animation
- **vanilla-tilt** for card hover parallax
- **lenis** for smooth scrolling
- **@vercel/analytics** for deploy-side metrics

## Scripts

```sh
npm install
npm run dev      # start Vite dev server on :3000
npm run build    # production bundle to dist/
npm run preview  # serve the built bundle
npm run lint     # tsc --noEmit (type check only)
npm run clean    # remove dist/
```

## Project layout

```
src/
├── App.tsx                    Main shell. Audio handling, Lenis, code-split sections.
├── main.tsx                   Entry point.
├── index.css                  Tailwind theme tokens (colors + fonts).
├── hooks/
│   ├── usePretextLayout.ts    Pre-measure paragraph height via @chenglou/pretext.
│   └── useVanillaTilt.ts      Attach vanilla-tilt to a ref with cleanup.
├── lib/data.ts                Profile, experience, education, projects.
└── components/
    ├── Preloader/             Typed intro + progress bar.
    ├── Hero/                  Three-pillar landing: bio, identity, recent deeds.
    ├── About/                 Bio + animated stat counters.
    ├── Highlights/            Three primary deed cards.
    ├── Timeline/              Vertical career chronicle with parallax GIFs.
    ├── Projects/              Relic cards (portfolio projects).
    ├── Resume/                Contact + education + skill glyphs.
    ├── Contact/               Invocation form + bonfire canvas.
    ├── HumanityRestored/      Scroll-triggered cinematic flourish.
    ├── Footer/                Status line.
    └── shared/                AnimatedOutline, Bonfire, CindersOverlay,
                               CornerBrackets, CustomCursor, DispersingText,
                               Firelink, Navigation, RevealOnScroll,
                               SectionHeading, Sigil.
```

## Performance notes

Several components took care to keep the frame budget:

- `CindersOverlay` caps particle count and renders at `min(DPR, 1.5)`.
- `DispersingText` uses a single `pointermove` listener and a single RAF loop
  for the whole paragraph — character centers are cached on mount and
  re-measured on scroll / resize. Motion values stay per-character so the
  springs are untouched.
- `HumanityRestored` pre-calculates all particles and only renders them when
  the section is in view.
- Heavy sections (Timeline, Projects, Resume, Contact, HumanityRestored) are
  split into their own chunks via `React.lazy` so first paint doesn't block
  on the full bundle.
- Google Fonts are loaded via `<link rel="preconnect">` + `<link rel="stylesheet">`
  in `index.html` rather than a CSS `@import` — the CSS import blocks
  stylesheet parsing.
- The ambient audio track (`/public/DarkSouls3.mp3`, ~6.6MB) uses
  `preload="none"`; it is fetched on the first user interaction only.

## Assets

- `public/bonfire.jpg`, `public/eclipse.jpg`, `public/blackmaiden.jpg`,
  `public/HumanityNoBg.gif`, `src/assets/images/fire_keeper_*.png` —
  atmospheric imagery. Replace before distribution.
- `public/DarkSouls3.mp3` — optional ambient music.
- `public/CV_Maximilian_WikstromPDF.pdf`,
  `public/Degree%20of%20Bachelor%20of%20Science%20Maximilian%20Wikstrom.pdf`,
  `public/Integrating%20Agentic%20AI%20...%20Large%20Nordic%20Bank.pdf`,
  `public/Slutleverans.EduCal.pdf` — linked documents.

Imagery inspired by the FromSoftware Souls series is used for personal
portfolio purposes only; all copyright remains with the original rights
holders.

## License

Source code under Apache-2.0 (see SPDX headers at the top of each file).
Asset licenses apply separately.
