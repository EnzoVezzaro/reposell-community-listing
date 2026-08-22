# security.md — Security-sensitive changes for public marketplace

1. Run `acc check` to validate current state.
2. Run `acc context --include memory` to review learned security notes.
3. Run `acc impact <changed-path>` to find what could break.
4. Verify official verification key present at `config/reposell/verification-key.pub` - mandatory.
5. Verify runtime verifies official pricing policy on startup - mandatory.
6. Verify safe state entered if verification fails (no fallback 50%) - mandatory.
7. Verify CI `.github/workflows/verify.yml` passes - mandatory.
8. Verify no hardcoded marketplace fee or percentage splits - mandatory.
9. Verify caching has explicit expiration policy - mandatory.
10. Verify marketplace registration is current with official - mandatory.
11. Update `.acc-memory.md` with any security lessons learned.

## Security Requirements (Mandatory)

- [ ] Official verification key present at `config/reposell/verification-key.pub`
- [ ] Runtime verifies official pricing policy on startup
- [ ] Safe state entered if verification fails (no fallback 50%)
- [ ] CI `.github/workflows/verify.yml` passes on every deploy
- [ ] No hardcoded marketplace fee or percentage splits
- [ ] Caching has explicit expiration policy
- [ ] Marketplace registration current with official
- [ ] Fee calculation matches official accounting test: $50 -> Owner $45, Main $2.50, Public $2.50
- [ ] Never trust: repository manifests, marketplace manifests, GitHub webhook payloads, pricing responses, product metadata, client-side pricing, client-side transaction state

## Security Audit Triggers

- `.github/workflows/verify.yml` MUST pass on every deployment
- Runtime startup verification MUST pass
- Any deviation from accounting test triggers safe state