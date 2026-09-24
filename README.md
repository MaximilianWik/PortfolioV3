# Maximilian Wikström - Portfolio

A React portfolio with a dark fantasy visual system. It uses Vite, Tailwind CSS, motion, Lenis, and canvas effects. :3

**Live:** https://maximilian-wikstrom.vercel.app/



https://github.com/user-attachments/assets/a7277eff-0063-409b-9792-f5d7a1e271bd




## Stack

- React 19 and TypeScript
- Vite 6
- Tailwind CSS 4
- motion/react
- vanilla-tilt
- Lenis
- Vercel Analytics

## Scripts

```sh
npm install
npm run dev      # Vite dev server on :3000
npm run build    # production bundle in dist/
npm run preview  # serve the production bundle
npm run lint     # TypeScript check
npm run clean    # remove dist/
```

## Project layout

```text
src/
├── App.tsx                    Application shell, audio, Lenis, lazy sections
├── index.css                  Theme tokens and global styles
├── hooks/
│   └── useVanillaTilt.ts      vanilla-tilt lifecycle helper
├── lib/data.ts                Profile, work history, education, and projects
└── components/
    ├── Preloader/             Intro screen
    ├── Hero/                  Landing section
    ├── About/                 Bio, tabs, and artifact index
    ├── Timeline/              Work history
    ├── Projects/              Artifact cards
    ├── Resume/                Education and skills
    ├── Contact/               Contact form and bonfire canvas
    ├── HumanityRestored/      Scroll-triggered effect
    ├── Footer/                Footer
    └── shared/                Reusable visual and interaction components
```

## Performance notes

- Non-hero sections load through `React.lazy`.
- Ambient effects mount after the preloader closes.
- Cinders starts off and only runs when enabled from the navigation.
- Canvas effects use a single animation loop and clean up listeners on unmount.
- Decorative timeline and resume animations stop outside their sections.
- The audio track uses `preload="none"` and starts only after user input.
- The hero image is preloaded from `index.html`.

## Assets

`public/` contains the imagery, documents, audio, and site metadata used by the portfolio. Replace copyrighted imagery before redistributing the project.

## License

Source code uses Apache-2.0 where SPDX headers are present. Assets have separate rights and restrictions.
