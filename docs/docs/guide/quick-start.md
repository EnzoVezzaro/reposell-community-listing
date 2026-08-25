---
title: Quick Start
description: Deploy your own reposell public listing instance — fork, configure, pin the verification key, deploy as a static site.
---

# Quick Start

Deploying your own public listing is a fork-and-configure job. There are no servers to provision — your instance ships as a static site with CI enforcing compliance on every deploy.

## 1. Fork the repository

Fork [EnzoVezzaro/reposell-community-listing](https://github.com/EnzoVezzaro/reposell-community-listing) and clone your fork. Everything you need ships in the repo: the frontend, the federation sync, the CI workflows.

## 2. Configure the official pricing endpoint

Point your instance at the official pricing endpoint of the listing you federate with:

```text
REPOSELL_OFFICIAL_LISTING_URL=https://listing.reposell.dev
```

The pricing policy is fetched from the official endpoint (for example `https://listing.reposell.dev/api/v1/pricing`), verified against the pinned key, and re-checked periodically. You never configure prices or fee splits yourself — that is the point.

## 3. Place the official verification key

The pinned official Ed25519 public key must exist at:

```text
config/reposell/verification-key.pub
```

This file is committed to the repository and is the root of trust for everything your instance accepts: trust documents, pricing policy and federation payloads. Startup fails closed without it. If the upstream listing rotates its keys, update this file from the signed trust document as described in [Verification Keys](./verification-keys).

## 4. Deploy as a static site

Build output is plain static files. Two supported paths:

- **GitHub Pages (recommended)** — enable Pages in your fork; the provided `deploy.yml` workflow publishes the build. Zero servers.
- **Any static host** — Cloudflare Pages, Netlify or equivalent all work: point them at the build output directory.

Whichever host you choose, deployment only happens after CI passes — see step 5.

## 5. CI compliance gates deployment

Three GitHub Actions workflows run in sequence:

| Workflow | Role |
| --- | --- |
| `verify.yml` | Fetches trust metadata and the pricing policy from the official listing, verifies all Ed25519 signatures, validates federation state. **Must pass.** |
| `build.yml` | Builds the site. Must pass. |
| `deploy.yml` | Publishes, but only if verify + build passed. |

If any verification check fails, deployment fails and nothing ships. This is intentional: a broken trust chain must never reach production.

## 6. Scheduled re-sync

Once deployed, keep the catalog fresh with a scheduled GitHub Actions workflow (cron). Each run pulls new catalog data through verified federation and republishes the generated JSON. The same runs re-verify the pricing policy and trust documents per their expiration policy (default 24 hours).

## 7. Verify your instance

After first deploy:

- The site loads with a populated catalog sourced from the official feed
- Product pages show Listing JSON plus live `/health` status
- Outbound buy links carry your referral attribution (`transaction.listing_id`)
- Killing network access to the official listing on next sync results in safe state — not stale sales

For what to expect when things go wrong, read [Safe State](./safe-state). For the components behind the curtain, see [Architecture](./architecture).
