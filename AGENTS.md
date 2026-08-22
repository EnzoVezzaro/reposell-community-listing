# reposell Public Marketplace

## Purpose

The reposell public marketplace is a community-operated marketplace implementation that anyone can deploy and operate independently. It discovers and indexes repository `/marketplace` endpoints directly, retrieves and verifies official pricing policies, registers with the official marketplace, and processes purchases with correct fee splits according to signed pricing policies.

## Responsibilities

- Discover and index repository `/marketplace` endpoints
- Verify repository manifests using official verification key
- Fetch and verify official pricing policy on startup and periodically
- Verify official trust document for key rotation
- Register with official marketplace as a public marketplace instance
- Process purchases with fee calculation from signed pricing policy
- Issue licenses and integrate with repository access/fork workflow
- Report settlements to official marketplace
- Run CI compliance validation on every deployment
- Enter safe state if official policy cannot be verified (no fallback percentages)

## Ownership

Owner: packages/backend

## Inputs

- Repository `/marketplace/manifest.json` endpoints
- Official pricing policy from `GET /api/v1/pricing`
- Official trust document for key rotation
- Official marketplace registration endpoint
- Stripe webhook events
- GitHub webhook events

## Outputs

- Local product catalog and search index
- Purchase records and licenses
- Settlement reports to official marketplace
- Marketplace identity and registration
- Cached pricing policy and trust metadata

## Dependencies

- # Backend API (to be implemented)
- # Frontend (to be implemented)
- # Database layer (to be implemented)
- # Official marketplace client (to be implemented)
- # Payment integration (to be implemented)
- # Git integration (to be implemented)
- # Crypto/verification (to be implemented)
- # Scheduler/sync (to be implemented)

## Constraints

- Official verification key MUST be present at `config/reposell/verification-key.pub`
- NEVER independently define marketplace fee or percentage splits
- CI workflow `verify.yml` MUST pass for deployment
- Runtime MUST verify pricing policy on startup
- MUST enter safe state if verification fails (no fallback 50%)
- Cached policy only per explicit expiration policy
- All financial operations MUST be idempotent
- MUST match official accounting test: $50 product, $5 fee, 50/50 split = Owner $45, Main $2.50, Public $2.50

## Architecture

The public marketplace is independently deployable:

1. **Frontend** - Bun + Vite + React + TypeScript + shadcn/ui + Tailwind
2. **API** - Versioned REST API for local operations
3. **Discovery** - Direct repository `/marketplace` endpoint scanning
4. **Verification** - Official key verification for all external data
5. **Database** - PostgreSQL with migrations
6. **Payment** - Stripe integration
7. **Sync** - Automated pricing/trust synchronization
8. **CI** - Mandatory compliance validation (verify.yml, build.yml, deploy.yml)

## Workflows

- See `.acc/config/workflows/feature.md` for the standard feature workflow.
- See `.acc/config/workflows/release.md` for the release automation workflow.