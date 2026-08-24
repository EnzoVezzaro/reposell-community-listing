# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-08-23

### Added
- **Federation client** (`src/federation/client.ts`): pulls the verified catalog from the official listing — fail-closed (unreachable/malformed → explicit errors, empty catalog, never guessed data)
- **Static frontend generator** (`src/frontend/render.ts`): product + catalog pages with discovery CTA wording rules ("Unlock discovery" — never "Buy software"), separate seller section marked independent, secrets dropped even from poisoned input
- **Landing**: full lx landing system ported from the CLI (FaultyTerminal hero with decrypt reveal, 4 theme layers, autoplay + glitch) with self-host-specific content (federation, fail-closed design, deployment guide)

### Changed
- Nav is icon-only: old VitePress default logos removed, site title text hidden (`siteTitle: false`), branding `icon.png` as menu icon + favicon

### Notes
- Community listings are federated views, never independent indexers (D11); the public frontend contains zero Stripe secrets

## [0.0.1] - 2026-08-22

### Added
- Initial repository structure with ACC framework
- Static frontend (Bun + Vite + React + TypeScript + shadcn/ui + Tailwind)
- Serverless API client for official listing endpoints
- Repository discovery & indexing (from /listing endpoints)
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
- No hardcoded listing fee or percentage splits
- Caching has explicit expiration policy
- Listing registration current with official
- Fee calculation matches official accounting test
- Never trust: repository manifests, listing manifests, GitHub webhooks, pricing responses, product metadata, client-side pricing, client-side transaction state

## [Unreleased]

### Planned
- Frontend UI (catalog, product detail, purchase flow, dashboard)
- Listing registration CLI command
- Automated sync scheduler (cron)
- Settlement reporting to official listing
- License delivery integration
- Multi-agent orchestration configuration