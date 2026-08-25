---
title: What is the community listing?
description: A community-operated listing instance anyone can run — a federated view of the official reposell listing.
---

# What is the community listing?

The reposell community listing is a community-operated listing instance. Anyone can deploy and operate one. It is not an independent marketplace — it is a **federated view of the official reposell listing** at [listing.reposell.dev](https://listing.reposell.dev).

The official listing stays the trust and settlement layer of the network. Your instance joins that network as a discovery node: it registers itself with the official listing, pulls its catalog through verified federation, and serves products locally under its own domain and UI.

Operationally it is lightweight by design: a static frontend over generated JSON, a federation sync, and CI that refuses to deploy anything failing verification. No servers, no containers — see [Architecture](./architecture) for the full picture.

## What an instance does

- **Registers with the official listing** — identity, domain, operator information, protocol version and an Ed25519 public key. The official listing issues a ListingIdentity on completion.
- **Pulls its catalog through verified federation** — every payload from the official registry feed is signature-checked before acceptance. An instance **never indexes repositories independently** and never invents catalog entries.
- **Verifies the official signed pricing policy** at startup and periodically thereafter. Economics come exclusively from the signed policy (`reposell/pricing/v1`), never from local configuration.
- **Serves locally** — a static frontend reads generated JSON: catalog pages, product pages with live health checks, and search over the synced index.
- **Earns reputation through curation quality** — discoveries, verified metadata, uptime, accurate health reporting and referrals. Volume without quality earns nothing; spam is penalized, not rewarded.

## What an instance is not

- **Not a seller.** Community listings do not sell anything. Buy links carry referral attribution (`transaction.listing_id`) back through the seller's `/sell` endpoint; settlement flows through the official listing.
- **Not an authority on money.** An instance cannot define fees, override percentages or fall back to hardcoded economics. If the signed policy cannot be verified, it enters [safe state](./safe-state) instead of guessing.
- **Not a crawler.** Discovery happens through the federation feed from the official listing, not by scanning GitHub or indexing repositories on its own.
- **Not self-reporting.** Reputation artifacts are consumed read-only from the official listing. There is no local XP authority.

## The division of trust

The network splits responsibilities deliberately:

| Concern | Official listing | Your instance |
| --- | --- | --- |
| Canonical registry | Owns it | Mirrors via federation |
| Pricing policy | Signs and publishes | Fetches and verifies |
| Trust / key rotation | Signs and publishes | Verifies and applies |
| Payments | Settlement layer | Referral attribution only |
| Discovery UX | One node among many | Yours to shape |

You own everything buyer-facing: domain, layout, categories, collections, copy. You own nothing that touches money or identity — those stay with the signed policy and the official settlement flow.

## Who this is for

- **Community operators** who want to run a directory for their ecosystem — a language community, a stack, a niche — backed by verified data instead of hand-maintained link lists.
- **Developers** studying a reference implementation of the federation protocol before building their own tooling on top of it.
- **Sellers** evaluating where discovery happens: every instance in the network sends attribution back through the official listing, so being listed once makes you discoverable everywhere.

If you only read one more page before deploying, make it [Quick Start](./quick-start).

## Why this model

Federation gives you ownership of the discovery experience — your domain, your categories, your collections — while the official listing guarantees that every product, price and key in your catalog is authentic and every sale settles correctly. You get a directory you control; buyers get signatures they can trust.

## Where to go next

- [How It Works](./how-it-works) — the federation flow end to end: registration, verification, catalog sync.
- [Architecture](./architecture) — components and verification layers behind the instance.
- [Quick Start](./quick-start) — deploy your own instance in a fork-and-configure session.
- [Verification Keys](./verification-keys) — how key pinning and rotation keep the trust chain intact.
- [Safe State](./safe-state) — what happens when verification fails, and why that is a feature.
