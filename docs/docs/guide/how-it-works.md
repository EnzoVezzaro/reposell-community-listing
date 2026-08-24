---
title: How It Works
description: The federation flow — register, verify, pull the verified catalog, serve locally.
---

# How It Works

A public listing instance participates in the reposell network through a strict sequence: register with the official listing, pass identity verification, pull the catalog through verified federation, then serve it locally. Every step that involves external data ends in an Ed25519 signature check.

## 1. Register the instance

The operator runs the registration command (`reposell listing register` or `listing register`). Registration sends to the official listing at [listing.reposell.dev](https://listing.reposell.dev):

- **Listing identity** — a generated identity for this instance
- **Ed25519 key pair** — private key stays local; the public key is registered upstream
- **Endpoint and domain** — where this instance is served
- **Operator information** — who runs it
- **Protocol version** — compatibility with the official protocol

The official listing verifies the submission and issues a `ListingIdentity`. Until registration completes, the instance has no standing in the network and no federation access.

## 2. Fetch and verify trust metadata

Before accepting any data, the instance fetches the official trust document from the official listing and verifies its signature against the pinned official verification key at `config/reposell/verification-key.pub`. The trust document carries the currently active official keys plus activation and expiration windows — this is what makes key rotation verifiable (see [Verification Keys](./verification-keys)).

Trust verification failure at startup means safe state. There is no bypass.

## 3. Pull the verified catalog

On a schedule (CI cron or any scheduler), the instance pulls its catalog from the official registry feed:

```text
official registry feed
        │  fetch
        ▼
verify Ed25519 signature on every payload
        │  valid
        ▼
accept into local catalog / index
```

Signatures are checked on every payload before acceptance — not once per session. Invalid payloads are rejected; if the feed as a whole cannot be fetched and verified, the instance refuses to serve a catalog rather than serve stale or unverified entries. This is why an instance never indexes repositories independently: everything it shows came from the official listing and can be proven to have done so.

## 4. Serve locally

The verified catalog is written as generated JSON consumed by the static frontend:

- Product pages render the Listing JSON and perform a live client-side `/health` fetch against the owner's endpoint, so health status is always current.
- Outbound buy links carry referral attribution (`transaction.listing_id`) so purchases route through the seller's `/sell` endpoint with your instance credited for the referral.
- Settlement of referral shares is reported through the official settlement flow, never handled locally.

## Runtime policy verification

Two documents are re-fetched and re-verified after startup, on a periodic sync:

| Document | Signed by | Purpose |
| --- | --- | --- |
| Pricing policy | Official reposell key | All fee splits and economics |
| Trust document | Official reposell key | Active keys, rotation windows |

Cached copies are honored only per the explicit expiration policy (default 24 hours). An expired cache is treated like a failed verification: safe state, not silent continuation. See [Safe State](./safe-state).

## Reputation

While your instance operates — valid manifests, successful synchronizations, accurate health reporting, uptime — the official listing tracks reputation on its behalf. Rewards favor curation quality over volume: mass submissions earn nothing, maintained directories do. Your instance displays these artifacts read-only; it cannot mint XP locally.
