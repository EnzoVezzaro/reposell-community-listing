---
title: Architecture
description: Components of a public listing instance — static frontend, federation sync, signature verification, pricing policy sync, safe state.
---

# Architecture

A public listing instance is deliberately small: a static frontend, a federation sync process, and a verification layer that gates everything. There are no servers to run beyond static hosting and no Docker or Kubernetes topology — the deployment surface is generated JSON plus static files.

```text
        OFFICIAL LISTING (listing.reposell.dev)
        canonical registry · trust · settlement
                    │ federation (verified)
                    ▼
┌─────────────────────────────────────────────┐
│            PUBLIC LISTING INSTANCE          │
│                                             │
│  federation sync ──► local catalog JSON     │
│         │                     │             │
│         ▼                     ▼             │
│  signature verification   static frontend   │
│  (official Ed25519 key)   (reads JSON)      │
│         │                     │             │
│         └──────► safe state ◄─┘             │
└─────────────────────────────────────────────┘
```

## Static frontend

The frontend is a Bun + Vite + React + TypeScript application (shadcn/ui + Tailwind) that reads **generated JSON** produced by the sync:

- Catalog pages, categories and collections from the synced index
- Product pages rendering Listing JSON, with live client-side `/health` fetches to the owner's endpoint
- Search over the local index

Because the frontend reads only generated files, it deploys to any static host with zero backend infrastructure.

## Federation sync

`src/federation/sync.ts` pulls the catalog from the official registry feed on a schedule. It is the only source of catalog data. The sync:

1. Fetches payloads from the official listing feed
2. Verifies the Ed25519 signature on every payload before acceptance
3. Writes accepted entries into the local catalog/index
4. Runs idempotently — re-running a sync never duplicates entries

There is no independent repository discovery anywhere in the codebase. If the feed cannot be fetched and verified, no catalog is written.

## Signature verification

`src/federation/trust.ts` owns verification. All official data — trust documents, pricing policy, federation payloads — is checked against the **official Ed25519 public key pinned at `config/reposell/verification-key.pub`**.

Verification flow for any external artifact:

```text
fetch artifact → fetch signature → verify signature
      → validate schema → validate expiration/version → accept
```

Failure at any step blocks acceptance. The pinned key itself can be rotated only through signed trust documents — see [Verification Keys](./verification-keys).

## Pricing policy sync

The instance fetches the official signed pricing policy from the configured official pricing endpoint (for example `https://listing.reposell.dev/api/v1/pricing`) at startup and re-verifies it on periodic sync.

Rules enforced by design:

- Fee splits come **exclusively** from the verified policy (`reposell/pricing/v1`). The instance never defines fees locally and has no fallback percentages — not even "reasonable" ones.
- Cached policies are honored only per the explicit expiration policy (default 24 hours). An expired cache is treated as unverified.
- The canonical accounting invariant must hold: a $50 product with a $5 fee split 50/50 yields $45 to the owner, $2.50 to the main listing, $2.50 to the public listing.

## Safe state

Every component funnels into the same failure behavior: if trust metadata, the pricing policy or federation data cannot be fetched **and verified**, the instance enters [safe state](./safe-state). It stops serving purchasable content, alerts the operator through logs, and never invents economics to keep running. Fail-closed is the core architectural constraint that makes a community-operated instance trustworthy.

## CI compliance

`.github/workflows/verify.yml` replays the same verification in CI on every deploy: fetch trust metadata, verify signatures, fetch and verify the pricing policy, validate federation state. Deployment fails if any check fails — broken verification means nothing ships. See [Deployment](/deployment/).
