# Small Door / Little Worlds

A minimal two-page personal portfolio, built with **React + Vite + JavaScript + Tailwind CSS**. The approved Small Door and Little Worlds concepts are translated into responsive, working pages — not a screenshot of a website.

## Run locally

Requires Node.js 22.12+ (Node.js 24 recommended).

```sh
npm ci
npm run dev
```

Vite prints the development URL. For a production build:

```sh
npm test
npm run build
npm run preview -- --port 4173
```

`dist/` is the deployable static site. `npm run preview` is a local review server, not a production hosting service.

## What is implemented

- `/`: personal About Me page, with an arched CSS door and a one-second door-opening transition into the collection.
- `/works`: Little Worlds, with four interactive project objects, one column on phones, two on tablets, four on desktops.
- Project details and contact placeholder in native dialogs, including Escape, focus containment, focus restoration, and scroll locking.
- Back/forward navigation, direct `/works` entry, normal modified-click links, skip link, keyboard focus indicators, and reduced-motion support.
- Locally bundled CSS, system fonts, and optimized local WebP artwork. No font CDN, animation package, router package, analytics, cookies, or runtime API requests.

## Add your real information

Edit **`src/content.js`**:

- `profile.name`, `profile.role`, and `profile.note` are deliberately bracketed placeholders.
- `profile.contactUrl` is `null`; add your own `mailto:` or `https:` destination when ready.
- Each project's `url` is `null`; add the actual deployed `https:` project address when available.
- Replace each placeholder project description and note with verified details. The project names and categories follow the approved concept.

Missing destinations display an honest placeholder, not a fake external link. No stored email address or personal data is used. A small URL allowlist prevents `javascript:`, `data:`, protocol-relative, and insecure `http:` destinations.

**Solana Scanner stays labeled `Read-only / paper trading`.** This site does not connect wallets, request wallet permissions, execute trades, or handle funds.

## Deploy

Upload `dist/` to a static host with an SPA fallback: serve `/index.html` for an otherwise unknown path such as `/works`. Do not rewrite actual static assets. For example, on Nginx use `try_files $uri $uri/ /index.html;` within the site's location block; configure the equivalent rewrite on your chosen hosting provider. Deployment is intentionally not performed.

Serve over HTTPS. Set suitable security headers at your chosen host. No environment variables, API keys, or backend are needed. `package-lock.json` is included for repeatable installs; run `npm audit` again when deploying because vulnerability information changes.

## Design and assets

Cream background, forest-green type, restrained brass accents, system serif headings, small monospaced labels. The door is CSS rather than a 3D runtime. The four project images are optimized crops from the approved Little Worlds concept; they are illustrative project objects, not live application screenshots. Minor pedestal surfaces remain below some objects from the source concept.

`src/styles.css` imports Tailwind through the official Vite plugin and adds a small amount of bespoke CSS for the door, typography, gallery, and dialogs. No UI kit is used.

## Checks

`npm test` covers project data, placeholders, Solana labeling, and URL filtering. Browser review covers navigation, dialogs, image loading, direct route entry, and mobile/tablet layout. This is a frontend implementation and proportionate dependency/basic accessibility review, not a guarantee against every security or browser issue.

No existing project folders were overwritten. No Git commits or pushes were made.
