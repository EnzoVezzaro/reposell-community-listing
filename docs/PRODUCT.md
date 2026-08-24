# Product

## Register

brand

## Platform

web

## Users

**Primary**: DevOps/platform engineers deploying self-hosted public listing instances. They need Docker/K8s configs, CI/CD pipelines, compliance checklists.

**Secondary**: Community operators running independent listings — need governance docs, upgrade procedures, troubleshooting.

## Product Purpose

Community-operated public listing reference implementation. Features:
- Full protocol compliance (discovery, verification, settlement)
- Automatic pricing policy + trust document sync from official
- Safe-state default (enters read-only if verification fails)
- Mandatory CI compliance validation on every deploy
- Docker, Kubernetes, cloud provider deployment guides

## Positioning

**Your infrastructure. Your listing. Protocol-guaranteed compliance.**

## Conversion & proof

- **Primary CTA**: Deploy with Docker → 5-min quickstart
- **Secondary CTA**: Read Compliance Checklist → before production
- **Belief ladder**:
  1. Official listing is reference, not monopoly
  2. Anyone can run a compliant instance
  3. Protocol handles sync/verification automatically
  4. Safe state = never accidental wrong fees
  5. CI gate = compliance enforced, not hoped

## Brand Personality

Sovereign, reliable, transparent, community-governed.

**Reference (user-named):** [soundcn.xyz](https://www.soundcn.xyz) — warm-orange shadcn/ui energy: stone neutrals, playful motion, developer-tool warmth. All three reposell sites share this visual language.

## Anti-references

- Vendor lock-in platforms
- "Managed service" that hides protocol details
- Fallback fee percentages (protocol forbids this)
- Optional compliance

## Design Principles

1. **Compliance first** — Every page shows what's validated, what's required
2. **Operations visible** — Sync status, policy hash, verification timestamp always accessible
3. **Deployment explicit** — No hidden steps, every env var documented
4. **Terminal-native** — Dark mode default, mono-heavy, copy-paste configs