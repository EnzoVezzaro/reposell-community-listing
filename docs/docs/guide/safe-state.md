---
title: Safe State
description: Fail-closed behavior — what happens when verification fails and why the instance never invents fallback percentages.
---

# Safe State

The community listing has no authority to invent economics. When verification of official policy fails, the instance **fails closed**: it stops rather than guesses. This is not error handling bolted on afterwards — it is the design constraint that makes a community-operated instance trustworthy.

## When safe state triggers

Safe state is entered when any of the following fails at startup or during periodic sync:

- **Trust document verification** — the trust document from the official listing cannot be fetched, or its signature does not verify against the pinned key at `config/reposell/verification-key.pub`
- **Pricing policy verification** — the signed pricing policy cannot be fetched, its signature is invalid, or its schema/expiration validation fails
- **Federation data verification** — catalog payloads from the official feed fail signature checks or the feed is unreachable within the sync window
- **Expired cache** — a cached policy exists but the explicit expiration policy (default 24 hours) has lapsed without successful re-verification

## What safe state does NOT do

This list is the contract. None of these may ever happen:

- **No invented fallback percentages.** The instance never assumes a split like 50/50 because "that's what it usually is." A missing verified policy means no economics, period.
- **No local fee definitions.** Fees come exclusively from the signed official pricing policy (`reposell/pricing/v1`). There is no config file that can override this.
- **No stale sales.** Cached policies are honored only per the explicit expiration policy. An expired cache is treated exactly like a failed verification.
- **No purchase flow.** Checkout, licenses and settlement all stop. Money never moves on unverified terms.
- **No silent degradation.** The instance does not quietly keep serving yesterday's numbers while logging a warning nobody reads.

## What safe state looks like for operators

When your instance enters safe state:

- The site serves in read-only mode; purchasable content is disabled
- Visitors see "Verification failed — contact operator" instead of product economics
- Logs contain an explicit alert naming which verification failed (`Trust document verification failed`, `Pricing policy verification failed`, `Invalid pricing policy`, ...)
- CI deployment fails if the same condition holds there — broken verification never ships

## Common triggers and what they mean

| Log message | Cause | Fix |
| --- | --- | --- |
| `Trust document verification failed` | Signature mismatch against pinned key | Check for upstream rotation; update pinned key per trust document |
| `Pricing policy verification failed` | Bad signature or unreachable endpoint | Verify official listing URL; check upstream status |
| `Invalid pricing policy` | Schema validation failed upstream-side | Wait for corrected upstream policy; report if persistent |
| Expired cache warning | Sync missed the expiration window | Restore scheduler; re-run sync |

## Recovery

Recovering means restoring the trust chain, in order:

1. **Diagnose** — check logs for the exact failure: fetch failure, bad signature, expired policy, or expired cache.
2. **Check upstream** — is [listing.reposell.dev](https://listing.reposell.dev) healthy? Has it announced key rotation? A rotation you missed shows up as signature failures everywhere.
3. **Fix the cause** — restore network access, update the pinned verification key per the signed trust document (see [Verification Keys](./verification-keys)), or wait out an upstream incident.
4. **Let verification pass** — the next startup or scheduled sync re-runs the full chain: fetch → verify → validate → accept.
5. **Confirm CI green** — deploy only after `verify.yml` passes again.

There is no manual override to skip verification and serve anyway. If that is what you need, you do not want a federated instance — you want to build your own listing, with your own keys and your own accountability.

## Why fail-closed wins

An independent instance earns trust by giving up discretion. Buyers and sellers cannot inspect your server, but they can rely on one promise: *this instance either operates under the official signed policy or it does not operate.* Safe state is that promise being kept.

The canonical accounting invariant the policy must satisfy — $50 product, $5 fee, 50/50 split = owner $45, main listing $2.50, community listing $2.50 — is replayed by CI on every deploy, so the math is checked, not assumed.
