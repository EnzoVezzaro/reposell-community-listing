# Design

> **Implementation note:** VitePress DefaultTheme re-skinned via CSS variables in `branding/theme/styles/variables.css` + `custom.css` (motion.dev-derived lab system: paper+ink, electric-yellow CTA, blackcurrant links, aurora dark mode, wipe/rise/ticker animations). See `reposell/docs/DESIGN.md` for the canonical token sheet.

## Color

Inherits full palette from root. Public listing semantic usage:

- **Signal** — Deploy actions, CLI commands, primary CTAs
- **Verified** — Compliance checks passed, sync healthy, policy current
- **Pending** — Sync in progress, deploy pending, config validation
- **Invalid** — Compliance failed, sync error, safe state active

## Typography

Inherits font stack. Public listing specific:
- **CLI commands**: Geist Mono at --text-sm (copyable blocks)
- **Config keys/env vars**: Geist Mono at --text-xs
- **Status outputs**: Geist Mono with semantic colors
- **Kubernetes YAML**: Geist Mono, syntax highlighted

## Components

### Compliance Status Card

```css
.compliance-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
}
.compliance-card.pass {
  border-color: var(--color-verified);
  box-shadow: 0 0 0 1px var(--color-verified);
}
.compliance-card.fail {
  border-color: var(--color-invalid);
  box-shadow: 0 0 0 1px var(--color-invalid);
}
.compliance-card.warn {
  border-color: var(--color-pending);
  box-shadow: 0 0 0 1px var(--color-pending);
}
.check-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--color-border-subtle);
}
.check-row:last-child { border-bottom: none; }
.check-name { font-size: var(--text-sm); color: var(--color-fg); }
.check-status { /* uses verification-badge */ }
```

### Sync Status Panel

```css
.sync-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
}
.sync-metric {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}
.sync-metric.label { font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; letter-spacing: var(--tracking-wider); color: var(--color-fg-muted); }
.sync-metric.value { font-family: var(--font-data); font-variant-numeric: tabular-nums; font-size: var(--text-2xl); font-weight: 700; color: var(--color-fg); }
.sync-metric.meta { font-size: var(--text-xs); color: var(--color-fg-subtle); margin-top: var(--space-1); }
```

### Deployment Config Block

```css
.config-block {
  position: relative;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.7;
  overflow-x: auto;
}
.config-block .copy-btn {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-out);
}
.config-block:hover .copy-btn { opacity: 1; }
.config-block .copy-btn.copied { opacity: 1; color: var(--color-verified); }
```

### Safe State Banner

```css
.safe-state-banner {
  position: fixed;
  top: var(--vp-nav-height);
  left: 0;
  right: 0;
  z-index: var(--z-toast);
  background: var(--color-invalid);
  color: var(--color-invalid-fg);
  padding: var(--space-3) var(--space-6);
  text-align: center;
  font-weight: 500;
  animation: enter var(--duration-slow) var(--ease-out);
  box-shadow: var(--shadow-lg);
}
.safe-state-banner .icon { display: inline-flex; margin-right: var(--space-2); }
```

### CI Status Badge

```css
.ci-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  font-weight: 600;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
}
.ci-badge.pass { background: var(--color-verified-muted); color: var(--color-verified); }
.ci-badge.fail { background: var(--color-invalid-muted); color: var(--color-invalid); }
.ci-badge.pending { background: var(--color-pending-muted); color: var(--color-pending-fg); }
```

## Layout

### Docs Shell (terminal-density)

```css
.docs-shell {
  max-width: 100%;
  padding: var(--space-6) var(--space-8);
}
@media (min-width: 1280px) {
  .docs-shell { max-width: 1400px; margin: 0 auto; }
}
```

### Two-Pane Config Reference

```css
.config-reference {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: var(--space-8);
  min-height: calc(100vh - var(--vp-nav-height));
}
.config-toc {
  position: sticky;
  top: calc(var(--vp-nav-height) + var(--space-6));
  max-height: calc(100vh - var(--vp-nav-height) - var(--space-12));
  overflow-y: auto;
  border-right: 1px solid var(--color-border);
  padding-right: var(--space-6);
}
.config-content { padding-left: var(--space-6); }
@media (max-width: 1024px) {
  .config-reference { grid-template-columns: 1fr; }
  .config-toc { position: static; max-height: none; border-right: none; border-bottom: 1px solid var(--color-border); padding: var(--space-4) 0 var(--space-6); }
}
```

## Motion

- **Config copy**: Button flash (120ms)
- **Compliance check**: Staggered entrance (100ms per check)
- **Sync progress**: Determinate progress bar (ease-out)
- **Safe state banner**: Slide down from nav (ease-out)
- **Reduced motion**: All instant

## Sound Effects

- `deploy-success` — verify-success
- `compliance-pass` — verify-success (subtle)
- `compliance-fail` — verify-fail
- `sync-complete` — deploy
- `config-copied` — copy