# HFFG Dangerous Goods Load Planner — PWA

A fully offline-capable, installable web app. Everything (data, rule engine, UI)
is embedded in `index.html` — there is no build step and no external dependencies.

## Deploy to Vercel

1. Push this folder to a Git repo (GitHub/GitLab/Bitbucket), **or** drag-and-drop
   the folder directly at https://vercel.com/new.
2. Framework preset: choose **"Other"** (or leave auto-detected — there's no
   build command needed; Vercel will serve the files as a static site).
3. Deploy. That's it — no environment variables, no build settings required.

Vercel CLI alternative, from inside this folder:
```
npm i -g vercel
vercel --prod
```

## Files

- `index.html` — the entire application (data + rule engine + UI), self-contained.
- `manifest.json` — PWA manifest (name, icons, standalone display mode).
- `sw.js` — service worker; precaches the app shell and all icons on first
  visit so the app keeps working with no network at all afterward.
- `vercel.json` — cache headers (service worker never cached by the browser,
  so updates roll out cleanly; icons cached aggressively since they never change).
- `icons/` — full PWA icon set generated from the supplied crest artwork.

## Installing as an app ("Add to Home Screen")

- **iOS (Safari):** open the deployed URL → Share → *Add to Home Screen*.
- **Android (Chrome):** open the URL → menu (⋮) → *Install app* /
  *Add to Home Screen*.
- **Desktop (Chrome/Edge):** open the URL → an install icon appears in the
  address bar → *Install*.

Once installed, the app opens in its own standalone window with the HFFG
crest icon, and works with the device in flight-mode / fully offline — the
first visit (while online) is what caches everything; every visit after that
needs no network.

## Updating after changes

Bump `CACHE_VERSION` at the top of `sw.js` on every deploy (e.g. `v1` → `v2`).
That forces the service worker to fetch a fresh copy of everything and retire
the old cache, so users automatically get the update next time they have a
connection — without it, previously-installed users could keep seeing a
stale cached version indefinitely.
