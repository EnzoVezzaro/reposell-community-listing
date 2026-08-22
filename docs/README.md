# reposell Public Marketplace

## Community Marketplace - reposell.dev

The reposell public marketplace is a community-operated implementation that anyone can deploy and operate independently. It discovers and indexes repository `/marketplace` endpoints directly, retrieves and verifies official pricing policies from `reposell.dev`, registers with the official marketplace, and processes purchases with correct fee splits according to signed pricing policies.

### Default Domain

All references use `https://reposell.dev` as the default domain:

- **Pricing**: `https://reposell.dev/pricing.json`
- **Trust**: `https://reposell.dev/trust.json`
- **Verification Key**: `https://reposell.dev/config/reposell/verification-key.pub`
- **Registration**: Static form at `https://reposell.dev/register`

### Key Principle

The public marketplace does NOT independently define:
- Marketplace fee
- Public marketplace percentage
- Main marketplace percentage

These values **MUST** come from the signed official pricing policy at `reposell.dev`. The public marketplace only retrieves, verifies, and applies them.

### Registration

Every public marketplace instance MUST register with the official marketplace at `reposell.dev`:

1. Generate marketplace identity (Ed25519 key pair)
2. Register public key with official
3. Register endpoint
4. Register operator information
5. Fetch official trust metadata (verify signatures)
6. Fetch pricing policy (verify signatures)
7. Validate configuration
8. Complete registration (official issues MarketplaceIdentity)

### Runtime Verification

On startup, the public marketplace MUST:

1. Fetch trust metadata from `reposell.dev` and verify signature
2. Fetch pricing policy from `reposell.dev` and verify signature
3. Validate policy (fees, percentages)
4. Enter **safe state** if verification fails (NO fallback 50%)
5. Cache with explicit expiration policy

### Fee Calculation (Must Match Official Accounting Test)

| Input | Expected Output |
|-------|----------------|
| Product: $50.00 | Owner: $45.00 |
| Fee: $5.00 | Main: $2.50 |
| Split: 50/50 | Public: $2.50 |

### License

MIT - see LICENSE for details.