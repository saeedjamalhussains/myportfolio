# myportfolio

Personal portfolio site — React 19 + Vite, with a lighting system instead of a dark-mode toggle.

## The lighting idea

Most sites have a sun/moon button. This one has a **dimmer**. Brightness is a
continuous value from 0 to 1, and two controls share it:

- **A brightness slider** — the dimmer.
- **A desk switch** — the on/off.

Both read and write the same state, so they can never disagree: flicking the
switch off slides the dimmer to the bottom, and dragging the dimmer to zero
flips the switch. Below `0.03` the page stops dimming and commits to a real dark
palette, rather than just stacking a darker veil on top of the light one.

The dim curve is squared, so the top of the range is visually untouched — the
page looks correct at rest and only starts dimming once you genuinely turn it
down.

See [`src/hooks/useLighting.js`](src/hooks/useLighting.js).

## Stack

React 19 · Vite 7 · React Router 7 · Framer Motion · Lenis (smooth scroll) ·
Lucide icons · CSS Modules

## Sections

`Hero` → `Cooking` (what's in progress) → `RecentWork` → `OtherWork` → `About`

Work entries live in [`src/data/work.js`](src/data/work.js), so adding a project
is a data edit, not a component change.

## Develop

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

## License

MIT — see [LICENSE](LICENSE).
