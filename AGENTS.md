# reposell Public Listing

## Purpose

The reposell public listing is a community-operated listing implementation that anyone can deploy and operate. It is a FEDERATED VIEW of the official listing: it registers itself with the official listing, obtains its product catalog through verified federation (never by indexing repositories independently), retrieves and verifies official pricing policies, and processes purchases with correct fee splits according to signed pricing policies.

## Responsibilities

- Register the listing instance with the official listing (identity, domain, protocol verification)
- Synchronize product catalog from the official listing via federation
- Earn reputation through curation quality (discoveries, verified metadata, uptime, referrals) — never through volume or spam; reputation and revenue are tracked separately
- Verify federation data using official verification key
- Fetch and verify official pricing policy on startup and periodically
- Verify official trust document for key rotation
- Register with official listing as a public listing instance
- Process purchases with fee calculation from signed pricing policy
- Issue licenses and integrate with repository access/fork workflow
- Report settlements to official listing
- Run CI compliance validation on every deployment
- Enter safe state if official policy cannot be verified (no fallback percentages)

## Ownership

Owner: packages/backend

## Inputs

- Federated catalog data from the official listing
- Official pricing policy from `GET /api/v1/pricing`
- Official trust document for key rotation
- Official listing registration endpoint
- Stripe webhook events
- GitHub webhook events

## Outputs

- Local product catalog and search index
- Purchase records and licenses
- Settlement reports to official listing
- Listing identity and registration
- Cached pricing policy and trust metadata

## Dependencies

- # Backend API (to be implemented)
- # Frontend (to be implemented)
- # Database layer (to be implemented)
- # Official listing client (to be implemented)
- # Payment integration (to be implemented)
- # Git integration (to be implemented)
- # Crypto/verification (to be implemented)
- # Scheduler/sync (to be implemented)

## Constraints

- Official verification key MUST be present at `config/reposell/verification-key.pub`
- NEVER independently define listing fee or percentage splits
- CI workflow `verify.yml` MUST pass for deployment
- Runtime MUST verify pricing policy on startup
- MUST enter safe state if verification fails (no fallback 50%)
- Cached policy only per explicit expiration policy
- All financial operations MUST be idempotent
- MUST match official accounting test: $50 product, $5 fee, 50/50 split = Owner $45, Main $2.50, Public $2.50

## Architecture

The public listing is independently deployable:

1. **Frontend** - Bun + Vite + React + TypeScript + shadcn/ui + Tailwind
2. **API** - Versioned REST API for local operations
3. **Federation** - Catalog synchronization from the official listing (verified federation, never direct repository indexing)
4. **Verification** - Official key verification for all external data
5. **Database** - PostgreSQL with migrations
6. **Payment** - Stripe integration
7. **Sync** - Automated pricing/trust synchronization
8. **CI** - Mandatory compliance validation (verify.yml, build.yml, deploy.yml)

## Workflows

- See `.acc/config/workflows/feature.md` for the standard feature workflow.
- See `.acc/config/workflows/release.md` for the release automation workflow.