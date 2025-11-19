# Herd on the Hill

Prototye for the V2 of the [Herd on the Hill](https://herdonthehill.org/) site.

Production source has moved to https://github.com/hothroot/herd

## Design Goals

- keep it simple to maintain and modify
- keep as much of the prose and page structure as possible in content-forward astro files in the pages directory.
- keep the server-side processes stateless for ease of maintainance and hosting
- use modern tools and frameworks to increase the pool of potential maintainers

## 🚀 Project Structure

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   └── letter/
│   │   |   └── AddressForm.tsx
│   │   |   └── Draft.tsx
│   │   └── ui/
│   │   └── Header.astro
│   │   └── PhotoCarousel.jsx
│   ├── layouts/
│   │   └── BaseLayout.astro
│   └── pages/
│       └── contact.astro
│       └── index.astro
│       └── letter.astro
│       └── volunteer.astro
│   └── scripts/
│       └── devdata.astro
│       └── letter-*.ts
│       └── search-reps.ts
│       └── states.astro
│   └── styles/
│       └── global.css
├── scripts/
│   ├── grant.js
└── package.json
```

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run test`            | Run the vitest unit tests (light)                |
| `npx playwright test`     | run playwright web automation tests (heavy)      |
| `npm run ci`              | continuous integration: test and build           |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

This project uses Astro, please reference thier [documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
