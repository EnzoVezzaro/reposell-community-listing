---
title: Deploying a public listing
description: GitHub Pages or any static host — CI compliance validation gates every deployment, scheduled actions keep the catalog in sync.
---

# Deploying a Public Listing

A public listing instance deploys as a **static site**. There are no servers to run, no containers to orchestrate, no database to host for the frontend itself — the build produces static files that read generated JSON from verified federation syncs.

## Prerequisites

Before deploying, confirm you have:

- A GitHub account (fork + Actions + Pages all live there)
- The official listing URL you federate with (default: `https://listing.reposell.dev`)
- No secrets to manage for serving — verification uses public keys only

## GitHub Pages (recommended)

GitHub Pages is the reference path: zero servers, zero cost, and CI lives next to deployment in the same repository.

1. Fork [EnzoVezzaro/reposell-listing-public](https://github.com/EnzoVezzaro/reposell-listing-public)
2. Ensure `config/reposell/verification-key.pub` is present (it ships with the repo)
3. Configure the official listing URL (`REPOSELL_OFFICIAL_LISTING_URL`, e.g. `https://listing.reposell.dev`) and the official pricing endpoint (`/api/v1/pricing`)
4. Enable GitHub Pages with the provided workflow as the source
5. Push — `verify.yml` → `build.yml` → `deploy.yml` run in order

## Any static host

The build output is plain static files, so any static hosting works:

- **Cloudflare Pages** — connect the fork, set the build command and output directory
- **Netlify** — same: point it at the repo and the build output

No special runtime is required on the host. Product pages perform live `/health` checks client-side; everything else is generated at build/sync time.

## CI compliance validation gates deployment

Deployment is not a button — it is a consequence of verification passing:

```text
verify.yml ──┐
             ├──► deploy.yml publishes
build.yml ───┘
```

`verify.yml` fetches trust metadata and the pricing policy from the official listing, verifies every Ed25519 signature against the pinned key, validates policy contents and federation state. If **any** check fails, the pipeline stops and nothing is deployed. A failed verification must never reach production.

## Scheduled re-sync via GitHub Actions

The catalog stays fresh through a scheduled (cron) GitHub Actions workflow:

1. Pull new catalog data from the official registry feed
2. Verify signatures on every payload before acceptance
3. Re-verify trust documents and pricing policy per their expiration policy (default 24 hours)
4. Regenerate the catalog JSON and redeploy the static site

Each successful run republishes your instance with current, verified data. Each failing run leaves the previously verified deploy in place while flagging the failure — and if verification cannot be restored, runtime behavior follows [Safe State](../guide/safe-state) rules.

## Operator responsibilities

Running an instance is lightweight but not zero-effort:

- Keep the pinned verification key aligned with official rotations (signed trust documents tell you when)
- Watch CI — red verify runs mean your trust chain needs attention before the next deploy
- Maintain uptime; federation reputation rewards maintained directories, and stale instances decay
- Curate well: reputation comes from curation quality — accurate metadata, healthy federation — never from volume
