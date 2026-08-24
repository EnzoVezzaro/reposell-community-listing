# reposell Public Listing

The reposell public listing is a community-operated implementation that anyone can deploy and operate independently. It discovers and indexes repository `/listing` endpoints directly, retrieves and verifies official pricing policies from `reposell.dev`, registers with the official listing, and processes purchases with correct fee splits according to signed pricing policies.

## Key Principle

The public listing does NOT independently define:
- Listing fee
- Public listing percentage
- Main listing percentage

These values **MUST** come from the signed official pricing policy at `reposell.dev`. The public listing only retrieves, verifies, and applies them.

## Registration

Every public listing instance MUST register with the official listing at `reposell.dev`:

1. Generate listing identity (Ed25519 key pair)
2. Register public key with official
3. Register endpoint
4. Register operator information
5. Fetch official trust metadata (verify signatures)
6. Fetch pricing policy (verify signatures)
7. Validate configuration
8. Complete registration (official issues ListingIdentity)

## Runtime Verification

On startup, the public listing MUST:

1. Fetch trust metadata from `reposell.dev` and verify signature
2. Fetch pricing policy from `reposell.dev` and verify signature
3. Validate policy (fees, percentages)
4. Enter **safe state** if verification fails (NO fallback 50%)
5. Cache with explicit expiration policy

## Fee Calculation (Must Match Official Accounting Test)

| Input | Expected Output |
|-------|----------------|
| Product: $50.00 | Owner: $45.00 |
| Fee: $5.00 | Main: $2.50 |
| Split: 50/50 | Public: $2.50 |

## Features

- **Product discovery** - Direct indexing from repository `/listing` endpoints
- **Stripe Embedded Checkout** - Payment UI in browser, no redirect
- **Official pricing verification** - All fees from signed policy
- **Runtime trust enforcement** - Safe state on verification failure
- **CI enforcement** - `.github/workflows/verify.yml` MUST PASS for deploy
- **Automatic sync** - Pricing, trust metadata, keys synced from official

## Default Domain

All references use `https://reposell.dev` as the default domain:

- **Pricing**: `https://reposell.dev/pricing.json`
- **Trust**: `https://reposell.dev/trust.json`
- **Verification Key**: `https://reposell.dev/config/reposell/verification-key.pub`
- **Registration**: Static form at `https://reposell.dev/register`

## Documentation

- [Protocol](docs/protocol.md)
- [Pricing Policy](docs/pricing.md)
- [Signatures](docs/signatures.md)
- [Listing Registration](docs/listing-registration.md)
- [Payment Architecture](docs/payment-architecture.md)
- [Development](docs/development.md)
- [Deployment](docs/deployment.md)
- [Security](docs/security.md)
- [Troubleshooting](docs/troubleshooting.md)

## License

MIT - see [LICENSE](LICENSE) for details.