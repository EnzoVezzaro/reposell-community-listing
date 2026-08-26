# reposell Community Listing

A community-operated listing frontend, federated from the official reposell registry. Anyone can deploy and operate an instance.

**No server, no database, no Docker.** Pure static frontend + GitHub Actions CI.

## Key Principle

This listing does NOT independently discover or index repositories. It pulls its product catalog from the official listing via verified federation, retrieves and verifies official pricing policies, and processes purchases with correct fee splits.

## Features

- **Federated catalog** — products synced from the official listing, not indexed directly
- **Stripe Embedded Checkout** — payment UI in the browser, no redirect
- **Official pricing verification** — all fees from signed policy
- **Runtime trust enforcement** — safe state on verification failure
- **CI enforcement** — `verify.yml` must pass for deploy
- **Discussion threads** — community engagement per listing

## Quickstart

```bash
npm install
npm run docs:dev      # local dev server at localhost:5173
```

## Documentation site

```bash
npm run docs:dev      # local dev server (auto-pulls federation data)
npm run docs:build    # production build (pulls federation + builds)
npm run docs:preview  # preview production build
```

The docs site is built with VitePress. Federation data is pulled from the official listing during every build via `scripts/pull-federation.mjs`.

## How Federation Works

```
┌──────────────────────────────┐
│   Official listing           │
│   listing.reposell.dev       │
│                              │
│  federation/v1/snapshot.json │  ← machine-readable registry
│  federation/v1/events.json   │  ← append-only event log
└──────────────┬───────────────┘
               │
               │  fetch (no auth needed)
               ▼
┌──────────────────────────────┐
│   Community listing          │
│   community.reposell.dev     │
│                              │
│  pull-federation.mjs         │  ← runs at build time
│  docs/public/registry/       │  ← materialized index
└──────────────────────────────┘
```

The community listing pulls from `listing.reposell.dev/federation/v1/snapshot.json` at build time. No write access to the official listing is required — it's a read-only consumer.

## CI Workflows

### `deploy-docs.yml` (on push to main)

1. Installs dependencies
2. Runs `registry:pull` (via `docs:build` script) — fetches federation snapshot
3. Builds the VitePress docs site
4. Deploys to GitHub Pages at `community.reposell.dev`

### `publish.yml` (on tag push)

1. Lint + typecheck + test
2. Build the npm package
3. Publish to npm as `reposell-community-listing`

## Project structure

```
reposell-community-listing/
├── scripts/
│   └── pull-federation.mjs     # fetches snapshot from official listing
├── src/
│   └── public.test.ts          # federation pull tests
├── docs/                       # VitePress documentation site
│   ├── public/registry/
│   │   └── listings.json       # generated from federation snapshot
│   ├── registry/
│   │   └── listings.md         # human-readable listings page
│   └── .vitepress/             # theme, config, layout
├── .github/workflows/
│   ├── deploy-docs.yml         # build + deploy to Pages
│   └── publish.yml             # npm publish on tag
└── package.json
```

## Configuration

The federation URL defaults to `https://listing.reposell.dev/federation/v1/snapshot.json`. Override with:

```bash
FEDERATION_URL=https://your-registry.example.com/federation/v1/snapshot.json npm run docs:build
```

## Deployment

### GitHub Pages

1. Fork this repository
2. Enable GitHub Pages (Settings → Pages → Source: GitHub Actions)
3. Push to `main` — the `deploy-docs.yml` workflow builds and deploys automatically

### Custom domain

The workflow writes a `CNAME` file for `community.reposell.dev`. To use your own domain, update the `CNAME` step in `.github/workflows/deploy-docs.yml`.

## License

MIT
