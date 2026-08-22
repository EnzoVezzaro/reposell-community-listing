# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-08-22

### Added
- Initial repository structure with ACC framework
- Static frontend (Bun + Vite + React + TypeScript + shadcn/ui + Tailwind)
- Serverless API client for official marketplace endpoints
- Repository discovery & indexing (from /marketplace endpoints)
- Product verification (from repository manifests)
- Stripe Embedded Checkout integration
- Stripe Connect for revenue split
- Official pricing policy verification (fetch + verify from reposell.dev)
- Official trust document verification (fetch + verify from reposell.dev)
- Runtime trust enforcement (safe state on verification failure)
- CI enforcement (.github/workflows/verify.yml MUST PASS for deploy)
- Automatic sync of pricing, trust metadata, keys from official
- Accounting test validation ($50 product → Owner $45, Main $2.50, Public $2.50)
- Anti-slop Oxlint plugin (14 generic rules at error level)
- Impeccable design/UX skill
- ACC framework integration (AGENTS.md, .acc/config/, .acc-memory.md)
- Custom open-source licensing scheme
- AI contribution verification (.github/pr_allow_providers.yml)
- Payment architecture documentation (Stripe Embedded Checkout + Connect)

### Changed
- N/A (initial release)

### Fixed
- N/A (initial release)

### Security
- Official verification key present at config/reposell/verification-key.pub
- Runtime verifies official pricing policy on startup
- Safe state entered if verification fails (no fallback 50%)
- CI verify.yml MUST pass on every deploy
- No hardcoded marketplace fee or percentage splits
- Caching has explicit expiration policy
- Marketplace registration current with official
- Fee calculation matches official accounting test
- Never trust: repository manifests, marketplace manifests, GitHub webhooks, pricing responses, product metadata, client-side pricing, client-side transaction state

## [Unreleased]

### Planned
- Frontend UI (catalog, product detail, purchase flow, dashboard)
- Marketplace registration CLI command
- Automated sync scheduler (cron)
- Settlement reporting to official marketplace
- License delivery integration
- Multi-agent orchestration configuration