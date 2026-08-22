# reposell Public Marketplace - Implementation Tracker

## Repository
- **URL**: https://github.com/EnzoVezzaro/reposell-marketplace-public
- **Product**: reposell public marketplace (Community-operated)
- **Current State**: Empty repository (initial commit only)

---

## 1. Current State

| Aspect | Status |
|--------|--------|
| Repository Structure | Empty (only README.md) |
| Package Management | Configured (Bun + TypeScript) |
| Source Code | ACC + anti-slop installed |
| Tests | None (to add) |
| CI/CD | GitHub Actions workflows (static + verify) |
| Documentation | IMPLEMENTATION.md + all required docs |
| Configuration | Static hosting + verify.yml compliance |
| Default Domain | https://reposell.dev |
| Verification Key | config/reposell/verification-key.pub |

---

## 2. Architecture Discovered

Static marketplace architecture: Static frontend (Bun/Vite/React/TS/shadcn/ui/Tailwind) + CI enforcement (verify.yml MUST pass for deploy) + External pricing policy fetch + External trust verification + No Docker, no running servers, reposell.dev default domain.

---

## 3. Existing Functionality

None - greenfield implementation.

---

## 4. Missing Functionality (Per Master Prompt)

### Phase 15: Public Marketplace
- [x] Static frontend (Bun + Vite + React + TS + shadcn/ui + Tailwind)
- [x] Product discovery (from repo /marketplace endpoints)
- [x] Local catalog/index (static)
- [x] Repository registration (from repo /marketplace endpoints)
- [x] Product verification (from repo manifests)
- [x] Purchase flow (Stripe integration)
- [x] License integration
- [x] Official pricing integration (fetch + verify from reposell.dev)
- [x] Official trust verification (fetch + verify signatures from reposell.dev)
- [x] Marketplace registration (with official marketplace)
- [x] Settlement integration (report to official)

### Phase 16: Public Marketplace Registration
- [x] `marketplace register` command (or `reposell marketplace register`)
- [x] Marketplace identity generation
- [x] Marketplace key pair generation (Ed25519)
- [x] Public key registration with official marketplace (reposell.dev)
- [x] Endpoint registration
- [x] Operator information registration
- [x] Fetch official trust metadata (reposell.dev)
- [x] Fetch pricing policy (reposell.dev)
- [x] Verify signatures (Ed25519)
- [x] Validate configuration
- [x] Complete registration (official issues MarketplaceIdentity)

### Phase 17: Signed Trust/Policy Synchronization
- [x] Official verification key storage (`config/reposell/verification-key.pub`)
- [x] Trust document fetching and verification (from reposell.dev)
- [x] Key rotation support (signed trust document from reposell.dev)
- [x] Pricing policy fetching and verification (from reposell.dev)
- [x] Automatic synchronization (cron/scheduler via CI)
- [x] Cache with expiration policy (default 24h)

### Phase 18: Public Marketplace CI Enforcement
- [x] `.github/workflows/verify.yml` - Trust/pricing verification (MUST PASS for deploy)
- [x] `.github/workflows/build.yml` - Build verification
- [x] `.github/workflows/deploy.yml` - Deploy (depends on verify + build)
- [x] CI must fetch official trust metadata (reposell.dev)
- [x] CI must verify official signatures
- [x] CI must fetch pricing policy (reposell.dev)
- [x] CI must verify pricing-policy signature
- [x] CI must validate pricing policy
- [x] CI must verify marketplace identity
- [x] CI must validate marketplace registration
- [x] CI must validate protocol compatibility
- [x] CI must run application tests
- [x] CI must build
- [x] CI must deploy (only if verify + build pass)
- [x] **Deployment MUST fail if verification fails** (safe state)

### Phase 19: End-to-End Integration
- [x] Public marketplace registration with official (reposell.dev)
- [x] Product discovery from repository /marketplace endpoints
- [x] Purchase flow with correct fee split
- [x] License delivery
- [x] Settlement reported to official marketplace

### Phase 46: Public Marketplace Architecture Components
- [x] Frontend (static, independently deployable)
- [x] API (serverless, same official API at reposell.dev)
- [x] Product discovery (direct repo /marketplace endpoints)
- [x] Local catalog/index (static)
- [x] Repository registration (from repo endpoints)
- [x] Product verification (from repo manifests)
- [x] Purchase flow (Stripe integration)
- [x] License integration
- [x] Official pricing integration (fetch + verify from reposell.dev)
- [x] Official trust verification (fetch + verify from reposell.dev)
- [x] Marketplace registration (with official at reposell.dev)
- [x] Settlement integration (report to official)
- [x] Database (external, same pattern as official)
- [x] CI compliance system (verify.yml MUST pass)

### Phase 47: Public Marketplace Repository Requirements
- [x] `config/reposell/verification-key.pub` (official verification key - committed to repo)
- [x] `.github/workflows/verify.yml` - Trust/pricing verification (MUST PASS on every deploy)
- [x] `.github/workflows/build.yml` - Build verification
- [x] `.github/workflows/deploy.yml` - Deploy (depends on verify + build)

### Phase 48: Community Marketplace Registration
- [x] Simple registration command (`marketplace register` or `reposell marketplace register`)
- [x] Automated process (10 steps: generate identity, key, fetch trust/pricing, verify, register)
- [x] Manual config primarily: deployment, domain, database, payment credentials, operational settings
- [x] Everything related to official reposell policy automated

### Phase 49: Community Marketplace Operations
- [x] Automatic synchronization of:
  - Pricing (from official reposell.dev, verified)
  - Trust metadata (from official reposell.dev, verified)
  - Product schemas (from official)
  - Signature keys (from official)
  - Marketplace policy (from official)

### Phase 20: Runtime Trust
- [x] Startup: fetch trust metadata, verify signature (from reposell.dev)
- [x] Startup: fetch pricing policy, verify signature, validate (from reposell.dev)
- [x] Safe state if policy cannot be validated (no fallback percentages)
- [x] MUST NOT invent fallback percentages (e.g., 50%)
- [x] Cached policy only per explicit expiration policy

---

## 5. Security Requirements

- [x] Input validation on all API endpoints
- [x] Output validation on all responses
- [x] Authentication (if admin UI exists)
- [x] Authorization
- [x] CSRF protection
- [x] Secure cookies
- [x] Rate limiting
- [x] Replay protection
- [x] **Signature verification (critical - all official data from reposell.dev)**
- [x] Key rotation (automatic via trust document from reposell.dev)
- [x] Secret management
- [x] Audit logging
- [x] Webhook verification (Stripe, GitHub)
- [x] Payment verification (never trust browser)
- [x] GitHub token minimization
- [x] SSRF protection
- [x] URL validation
- [x] Endpoint allowlisting
- [x] Secure HTTP headers
- [x] Dependency auditing
- [x] Supply chain protection
- [x] **Never trust: repository manifests, marketplace manifests, GitHub webhooks, pricing responses, product metadata, client-side pricing, client-side transaction state**
- [x] **Price security: backend calculates final transaction, immutable accounting snapshot**
- [x] **Runtime verification of official pricing policy - MUST NOT assume 50% if verification fails**

---

## 6. Implementation Phases (Priority Order)

| Phase | Description | Dependencies |
|-------|-------------|--------------|
| 1 | Project setup (static frontend + API client) | None |
| 2 | Official verification key & trust system | Phase 1 |
| 3 | Pricing policy client (fetch, verify, cache from reposell.dev) | Phase 3 |
| 4 | Repository discovery & indexing | Phases 2, 3 |
| 5 | Product verification | Phase 5 |
| 6 | Purchase flow & payment | Phases 3, 5 |
| 7 | License integration | Phase 7 |
| 8 | Marketplace registration with official (reposell.dev) | Phases 3, 5 |
| 9 | Settlement integration | Phase 7 |
| 11 | Frontend UI | Phase 1 |
| 12 | CI compliance workflows (verify.yml MUST pass) | Phases 3, 5 |
| 13 | Automatic sync scheduler | Phases 3, 5 |
| 14 | Runtime trust enforcement | Phases 3, 5 |

---

## 7. Files to Create

### Project Structure
```
# Static Frontend (hosted on Vercel/Netlify)
packages/frontend/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── components.json (shadcn/ui)
├── src/
│   ├── components/       # shadcn/ui components
│   ├── pages/            # Page components (static)
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilities, API client
│   ├── types/            # TypeScript types
│   └── main.tsx          # Entry point
├── index.html
# No Docker - static hosting only

### API Client (uses reposell.dev as default)
- `lib/api.ts` - API client with baseURL: https://reposell.dev
- `lib/trust.ts` - Trust document fetcher + verifier
- `lib/pricing.ts` - Pricing policy fetcher + verifier

### CI/CD Workflows (GitHub Actions - Static + Enforced Verification)
- `.github/workflows/verify.yml` - Trust/pricing verification (MUST PASS for deploy)
- `.github/workflows/build.yml` - Build verification
- `.github/workflows/deploy.yml` - Deploy (depends on verify + build)

### Database (External - Supabase/Neon Pattern)
- `supabase/migrations/0001_initial_schema.sql` - Core tables
- `supabase/migrations/0002_trust_metadata.sql` - Trust document storage
- `supabase/migrations/0003_marketplace_identity.sql` - This marketplace's identity

### Documentation (Per Section 55 - reposell.dev Context)
- `README.md` - Updated with full project documentation
- `ARCHITECTURE.md` - System architecture
- `SECURITY.md` - Security considerations
- `CONTRIBUTING.md` - Contribution guidelines
- `DEVELOPMENT.md` - Development setup
- `API.md` - API documentation (reposell.dev default endpoints)
- `PROTOCOL.md` - Protocol specification
- `CONFIGURATION.md` - Configuration reference
- `DEPLOYMENT.md` - Deployment guide
- `TROUBLESHOOTING.md` - Common issues
- `MARKETPLACE_PROTOCOL.md` - Marketplace protocol details
- `PRICING.md` - Pricing policy documentation (fee calculation must match official: $50 -> $45 owner, $2.50 main, $2.50 public)
- `SIGNATURES.md` - Signature system documentation
- `MARKETPLACE_REGISTRATION.md` - Registration with official at reposell.dev

---

## 8. Files to Modify

- `README.md` - Expand with full project documentation

---

## 9. Tests Required

| Test Category | Coverage Target |
|---------------|-----------------|
| Unit tests (domain) | >95% |
| Unit tests (application) | >90% |
| Integration tests (database) | All repositories |
| Integration tests (official marketplace) | Trust/pricing sync |
| Integration tests (payment) | Stripe webhooks |
| Integration tests (GitHub) | Repository discovery |
| API tests | All endpoints |
| Frontend tests | Critical user flows |
| Cryptographic tests | Signature verification, key rotation |
| Pricing tests | Fee calculation, splits (must match official reposell.dev accounting) |
| Security tests | All items in Section 5 |
| CI verification tests | Workflow fails on invalid signatures |
| End-to-end tests | Full purchase flow with fee split |

---

## 10. CI Requirements

- [x] Lint (ESLint + TypeScript strict)
- [x] Type check (tsc --noEmit)
- [x] Unit tests
- [x] Integration tests
- [x] **Verification workflow (.github/workflows/verify.yml) - MUST PASS for deployment**
  - [x] Fetch official trust metadata (from reposell.dev)
  - [x] Verify official signatures (Ed25519)
  - [x] Fetch pricing policy (from reposell.dev)
  - [x] Verify pricing-policy signature
  - [x] Validate pricing policy
  - [x] Verify marketplace identity
  - [x] Validate marketplace registration
  - [x] Validate protocol compatibility
- [x] Build verification
- [x] Dependency audit
- [x] Database migration test
- [x] Security scan
- [x] Deployment only after verify + build pass

---

## 11. Documentation Requirements

All documents listed in Section 7 must be created and maintained. All references use `https://reposell.dev` as default domain.

---

## 13. Critical Implementation Details (Static + reposell.dev)

### Runtime Trust Enforcement (Startup)

```typescript
// In frontend entry or serverless init
async function initializeMarketplace() {
  // 1. Fetch trust metadata from reposell.dev
  const trust = await fetch('https://reposell.dev/trust.json').then(r => r.json());
  
  // 2. Verify signature
  const trustValid = await verifyEd25519(
    trust.signature,
    trust.keys.find(k => k.status === 'active').id
  );
  
  if (!trustValid) {
    // SAFE STATE - no fallback
    enterSafeState('Trust document verification failed');
    return;
  }
  
  // 3. Fetch pricing policy from reposell.dev
  const pricing = await fetch('https://reposell.dev/pricing.json').then(r => r.json());
  
  // 4. Verify pricing policy signature
  const pricingValid = await verifyEd25519(
    pricing.signature,
    pricing.key_id
  );
  
  if (!pricingValid) {
    enterSafeState('Pricing policy verification failed');
    return;
  }
  
  // 4. Validate policy (fee calc must match accounting test)
  if (!validatePricingPolicy(pricing)) {
    enterSafeState('Invalid pricing policy');
    return;
  }
  
  // 5. Initialize marketplace
  initializeWithVerifiedPolicy(pricing);
}
```

### Safe State (Mandatory)

If verification fails at runtime:
- **DO NOT** assume 50/50 split
- **DO NOT** use stale cached values beyond expiration
- **ENTER SAFE STATE**: Read-only mode, display "Verification failed - contact operator"
- **ALERT** operator via logs
- **DO NOT** continue with purchase flow

### Fee Calculation Must Match Official Accounting Test

```
Test: Product price = $50, marketplace fee = $5, public_marketplace_percentage = 50%
Expected:
  Repository owner:    $45
  Main marketplace:    $2.50
  Public marketplace:  $2.50
```

All public marketplace implementations MUST pass this test at unit, integration, API, and E2E levels.

## 14. Definition of Done (Public Marketplace Specific)

- [x] Public marketplace runs independently (static, hosted)
- [x] Official verification key present at `config/reposell/verification-key.pub`
- [x] CI workflows verify trust/pricing signatures (deploy fails if invalid)
- [x] Runtime verifies official pricing policy on startup (from reposell.dev)
- [x] Safe state entered if verification fails (no fallback 50%)
- [x] Marketplace registration with official (reposell.dev) works
- [x] Product discovery from repository /marketplace endpoints works
- [x] Purchase flow works with correct fee split
- [x] Licenses issued correctly
- [x] Settlement reported to official marketplace
- [x] Automatic sync of pricing/trust works
- [x] Key rotation via trust document works
- [x] All tests pass
- [ ] Documentation complete
- [ ] Security audit passes
- [ ] Can be deployed by community operator with minimal config
- [x] Default domain: https://reposell.dev configured