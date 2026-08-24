---
title: Verification Keys
description: Official key pinning, trust documents for rotation, and why instances must never hardcode one eternal key.
---

# Verification Keys

Every artifact a public listing instance accepts — trust documents, the pricing policy, federation payloads — carries an Ed25519 signature. Verification is only as good as the key you verify against, so key handling is a first-class part of the architecture.

## The pinned official verification key

The root of trust is the **official Ed25519 public key**, pinned in your repository at:

```text
config/reposell/verification-key.pub
```

This file is committed to the repo and read at startup and in CI. It is a public key: safe to commit, safe to distribute, contains no secret. What it pins is *who* you will accept data from — only payloads signed by the matching official private key pass verification.

The path can be overridden via `REPOSELL_VERIFICATION_KEY_PATH`, but the default location is what CI expects.

## Why not just hardcode one eternal key

A single hardcoded key that lives forever is a liability, not a simplification:

- If the official signing key is ever compromised, every instance pinning the old key has no verifiable way to move to the new one — they would either trust a known-bad key or break.
- If the official listing legitimately rotates keys (normal operational hygiene), hardcoded instances stop verifying and enter safe state permanently until someone edits source code.
- An eternal key invites shortcuts: "the key expired but the data looks fine" becomes "accept it anyway." Fail-closed only works when rotation is a supported path, not an emergency hack.

Instead, keys rotate through signed trust documents.

## Trust documents

The official listing publishes a **trust document** signed with the current official key:

```json
{
  "keys": [
    { "id": "official-2026-01", "status": "active",   "not_before": "...", "expires_at": "..." },
    { "id": "official-2025-06", "status": "retired",  "not_before": "...", "expires_at": "..." },
    { "id": "official-2026-07", "status": "upcoming", "not_before": "...", "expires_at": "..." }
  ]
}
```

Each entry carries an activation window (`not_before`) and an expiration window (`expires_at`). Rotation works like this:

1. The new key appears in a signed trust document with status `upcoming` or `active`.
2. Because the trust document itself verifies against your currently pinned key, you can trust its contents.
3. Your instance accepts signatures from active keys within their validity windows and rejects retired ones once expired.
4. Your local pinned key is updated accordingly — a config change validated by CI, not a blind jump of faith.

History stays verifiable even after keys change, because old documents were signed by old keys whose full lifecycle is recorded in subsequent trust documents.

## Runtime and CI both verify

Verification happens in two independent places:

- **Runtime** — at startup and on periodic sync, the instance fetches and verifies trust metadata and the pricing policy against the pinned key before serving anything.
- **CI** — `.github/workflows/verify.yml` repeats the same checks on every deploy and fails the pipeline if any signature or expiration check fails.

Two enforcement points mean a bad key state cannot slip through by skipping one of them. If both runtime and CI agree verification failed, your instance is in [safe state](./safe-state) until the trust chain is restored.

## Operator checklist

- `config/reposell/verification-key.pub` exists and matches the official published key
- Trust document sync is running on schedule; rotation notices are acted on before expiry
- Never replace the pinned key based on unverified instructions — updates flow through signed trust documents
- CI green means the whole chain verified on the latest deploy
