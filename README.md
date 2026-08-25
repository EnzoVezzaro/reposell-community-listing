# reposell Public Listing

A community-operated listing frontend, federated from the official reposell registry. Anyone can deploy and operate an instance.

## Key Principle

This listing does NOT independently discover or index repositories. It pulls its product catalog from the official listing via verified federation, retrieves and verifies official pricing policies, and processes purchases with correct fee splits.

## Features

- **Federated catalog** — products synced from the official listing, not indexed directly
- **Stripe Embedded Checkout** — payment UI in the browser, no redirect
- **Official pricing verification** — all fees from signed policy
- **Runtime trust enforcement** — safe state on verification failure
- **CI enforcement** — `verify.yml` must pass for deploy

## Quickstart

```bash
npm install
npm run dev
```

## Documentation

- [CLI Reference](https://listing.reposell.dev)
- [Protocol](https://listing.reposell.dev/protocol/)

## License

MIT
