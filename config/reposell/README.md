# Official verification key

This directory must contain the OFFICIAL reposell listing signing key,
pinned as `verification-key.pub` (SPKI PEM, Ed25519). The federation client
only accepts catalog data whose `.sig` verifies against this key — or the key
embedded in the signature payload.

## Provisioning

The official listing signs its index with the RepoSell official Ed25519 key
(`LISTING_SIGNING_KEY` Actions secret). The matching PUBLIC key is published by
the official listing at:

    https://listing.reposell.dev/registry/verification-key.pub

Pin a copy here (exact bytes, signed content is the same key your site then
verifies):

```bash
mkdir -p config/reposell
curl -fsSL https://listing.reposell.dev/registry/verification-key.pub -o config/reposell/verification-key.pub
```

You can also generate/confirm the key locally with the reposell CLI:

```bash
cd reposell && npx reposell keys show   # prints the public PEM for the configured signing key
```

## Behavior

- Present: federation data is verified against it (and against the embedded
  key); a mismatch fail-closes to an EMPTY index.
- Absent: `.sig` embedded-key verification still applies
  (`scripts/pull-federation.mjs`), and `verify.yml` fails closed because the
  AGENTS constraint requires the pinned key.