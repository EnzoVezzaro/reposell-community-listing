---
layout: home
footer: false

title: reposell Listing — Self-Host
description: Run your own community listing. Federated from the official registry, fail-closed by design.
---

<LandingHero>
  <template #title>
    <h1 class="lx-title">Your own<br />listing.<br /><em>Federated.</em></h1>
  </template>
  <template #subtitle>
    <p class="lx-sub">Run a community discovery directory on your own domain. It federates from the
      official registry, verifies everything locally, and fails closed — a community
      listing is a federated view, never an independent indexer.</p>
  </template>
  <template #actions>
    <a class="lx-btn lx-btn--solid" href="#federation">How federation works</a>
    <a class="lx-btn lx-btn--ghost" href="#failclosed">Fail-closed by design</a>
  </template>
  <template #chip>
    <HomeCopyChip cmd="npx @reposell/cli listing federation sync" />
  </template>
  <template #trust>
    <ul class="lx-trust" aria-label="Works with">
      <li>Official registry</li>
      <li>Local verification</li>
      <li>Fail-closed</li>
      <li>Zero servers</li>
    </ul>
  </template>
</LandingHero>

<div class="lx-shell">
  <div class="lx-vprops">
    <div class="lx-vprop"><strong>Federated view</strong><span>Your catalog pulls from the official registry — never bypasses it.</span></div>
    <div class="lx-vprop"><strong>Your domain</strong><span>Your brand, your community, your curation.</span></div>
    <div class="lx-vprop"><strong>Fail-closed</strong><span>Broken federation shows an explicit safe state, never fake data.</span></div>
    <div class="lx-vprop"><strong>Read-only</strong><span>Community listings never create official payment links.</span></div>
  </div>

  <section id="federation" class="lx-section lx-reveal">
    <div class="lx-h2row">
      <span class="lx-num" aria-hidden="true">01</span>
      <div class="lx-h2block">
        <p class="kick">/ federation</p>
        <h2>One registry. Many doors.</h2>
        <p class="lede">Community listings register themselves with the official registry, then pull the verified catalog. The canonical record always lives with the seller and the official index.</p>
      </div>
    </div>
    <div class="lx-pipeline">
      <div class="lx-step"><strong>register</strong><span>Your listing proves identity, domain and configuration to the official registry.</span></div>
      <div class="lx-step"><strong>sync</strong><span>The verified catalog is pulled on your schedule — cached, static, yours.</span></div>
      <div class="lx-step"><strong>serve</strong><span>Product pages render locally and check the seller's live /health in the browser.</span></div>
    </div>
  </section>
</div>

<section class="lx-ticker" aria-hidden="true">
  <div class="lx-ticker-track">
    <span>Federated views</span><i>✦</i>
    <span>Fail-closed</span><i>✦</i>
    <span>Local verification</span><i>✦</i>
    <span>Seller-first</span><i>✦</i>
    <span>Federated views</span><i>✦</i>
    <span>Fail-closed</span><i>✦</i>
    <span>Local verification</span><i>✦</i>
    <span>Seller-first</span><i>✦</i>
  </div>
</section>

<div class="lx-shell">
  <section id="failclosed" class="lx-section lx-reveal">
    <div class="lx-h2row">
      <span class="lx-num" aria-hidden="true">02</span>
      <div class="lx-h2block">
        <p class="kick">/ safety</p>
        <h2>Broken is shown. Fake is impossible.</h2>
        <p class="lede">If the official registry is unreachable, the site says so. If a listing entry is malformed, it's skipped and reported. Nothing is invented to fill space.</p>
      </div>
    </div>
    <div class="lx-bento">
      <div class="lx-cell lx-wide lx-glow">
        <p class="lx-cell-title">Safe state, always</p>
        <p class="lx-cell-desc">Federation errors render as explicit error lists — visible, honest, actionable.</p>
        <code class="lx-code">errors <span class="k">rendered</span> <span class="m">never swallowed</span></code>
      </div>
      <div class="lx-cell">
        <p class="lx-cell-title">No secret credentials</p>
        <p class="lx-cell-desc">The public frontend contains zero Stripe secrets. Only public ids.</p>
        <code class="lx-code">secrets: <span class="s">none</span></code>
      </div>
      <div class="lx-cell">
        <p class="lx-cell-title">Live health</p>
        <p class="lx-cell-desc">Product pages check the seller's /health straight from the browser.</p>
        <code class="lx-code">GET <span class="k">/health</span> → <span class="s">live badge</span></code>
      </div>
      <div class="lx-cell">
        <p class="lx-cell-title">Sellers stay sellers</p>
        <p class="lx-cell-desc">Discovery here supports the network; software is always bought from the seller.</p>
        <code class="lx-code">discovery <span class="k">≠</span> purchase</code>
      </div>
    </div>
  </section>

  <section id="join" class="lx-section lx-reveal">
    <div class="lx-h2row">
      <span class="lx-num" aria-hidden="true">03</span>
      <div class="lx-h2block">
        <p class="kick">/ join</p>
        <h2>Spin one up.</h2>
        <p class="lede">This site IS the reference deployment — fork it, point it at the official registry, deploy to your own Pages.</p>
      </div>
    </div>
    <div class="lx-mathgrid lx-reveal">
      <div class="lx-mathcard">
        <p class="kick">fork + configure</p>
        <code class="lx-code">official: <span class="k">listing.reposell.dev</span></code>
        <p class="lx-math-note">Set the official catalog URL and your community identity in one config.</p>
      </div>
      <div class="lx-mathcard">
        <p class="kick">deploy</p>
        <code class="lx-code">static build → <span class="k">your Pages</span></code>
        <p class="lx-math-note">No servers. The build renders the verified catalog into plain HTML.</p>
      </div>
    </div>
  </section>

  <section id="jump" class="lx-section">
    <div class="lx-links">
      <a class="lx-link" href="https://listing.reposell.dev"><strong>Official listing</strong><span>The canonical discovery directory.</span></a>
      <a class="lx-link" href="https://github.com/EnzoVezzaro/reposell"><strong>reposell CLI</strong><span>Publish your repository to the registry.</span></a>
      <a class="lx-link" href="https://github.com/EnzoVezzaro/reposell-community-listing"><strong>This deployment</strong><span>Fork it and run your own.</span></a>
      <a class="lx-link" href="/guide/"><strong>Documentation</strong><span>Federation, verification and trust.</span></a>
    </div>
  </section>
</div>

<footer class="lx-footer">
  <FooterWordmark />
  <div class="lx-shell">
    <div class="lx-footer-grid">
      <div class="lx-fcol lx-fbrand">
        <h4>reposell listing — self-host</h4>
        <p class="lx-fblurb">A community discovery directory, federated from the official registry. Fail-closed by design.</p>
        <p>Made with ☕ and 🎧 by Enzo Vezzaro — a solo developer from the Dominican Republic, building for a team tomorrow.</p>
      </div>
      <nav class="lx-fcol" aria-label="Network">
        <h4>Network</h4>
        <ul>
          <li><a href="#federation">Federation</a></li>
          <li><a href="#failclosed">Fail-closed design</a></li>
          <li><a href="#join">Self-host</a></li>
          <li><a href="https://listing.reposell.dev">Official listing</a></li>
        </ul>
      </nav>
    </div>
    <div class="lx-bottombar">
      <span>© 2026 Enzo Vezzaro · MIT License</span>
      <span class="lx-socials">
        <a href="https://github.com/EnzoVezzaro/reposell-community-listing" target="_blank" rel="noopener">GitHub</a>
        <a href="https://github.com/EnzoVezzaro/reposell-community-listing/issues" target="_blank" rel="noopener">Issues</a>
      </span>
      <VersionChip />
    </div>
  </div>
</footer>
