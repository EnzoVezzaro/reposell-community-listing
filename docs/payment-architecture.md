# reposell Public Marketplace — Payment Integration (Static + CI)

## Architecture: Pure Static + CI

**No server, no API, no edge functions, no webhooks, no backend.** Pure static frontend + GitHub Actions CI.

## Key Difference: Official Policy Enforcement

The public marketplace **MUST** fetch and verify official pricing/trust from `reposell.dev`. Never hardcode fees or percentages.

## Static Frontend Structure

```
public-marketplace/
├── index.html                 # Product catalog
├── product/[id].html          # Product detail + checkout
├── purchase/success.html      # Post-payment verification
├── assets/
│   ├── stripe-checkout.js     # Stripe.js + Embedded Checkout
│   ├── pricing-policy.js      # Fetches & verifies signed policy
│   ├── trust-document.js      # Fetches & verifies trust doc
│   └── sync-scheduler.js      # Periodic sync (via CI cron)
├── connect/
│   └── onboard.html           # Connect onboarding (static redirect)
├── .github/workflows/
│   ├── verify.yml             # CI: verify pricing + trust (MUST PASS)
│   ├── build.yml              # Build + test
│   ├── deploy.yml             # Deploy (depends on verify + build)
│   └── sync.yml               # Nightly: sync pricing + trust
└── config/
    └── verification-key.pub   # Official public key (committed)
```

## Runtime Verification (On Every Page Load)

```javascript
// pricing-policy.js
const PRICING_URL = 'https://reposell.dev/pricing.json';
const TRUST_URL = 'https://reposell.dev/trust.json';
const OFFICIAL_PUBLIC_KEY = 'base64...'; // From config/verification-key.pub

async function verifyAndLoadPolicy() {
  // 1. Fetch trust document
  const trust = await fetch(TRUST_URL).then(r => r.json());
  if (!await verifyTrustChain(trust, ROOT_PUBLIC_KEY)) {
    enterSafeState('Trust document verification failed');
    return null;
  }
  
  // 2. Fetch pricing policy
  const policy = await fetch(PRICING_URL).then(r => r.json());
  if (!await verifyEd25519(policy.signature, policy.key_id, trust)) {
    enterSafeState('Pricing policy signature invalid');
    return null;
  }
  
  // 3. Validate policy constraints
  if (policy.public_marketplace_percentage + policy.main_marketplace_percentage !== 100) {
    enterSafeState('Invalid percentage split');
    return null;
  }
  
  // 4. Accounting test
  const fees = calculateFees(5000, policy);
  if (fees.owner !== 4500 || fees.main !== 250 || fees.public !== 250) {
    enterSafeState('Accounting test failed');
    return null;
  }
  
  // 5. Cache with expiration
  const cache = { policy, trust, expires: Date.now() + 3600000 };
  sessionStorage.setItem('reposell_policy', JSON.stringify(cache));
  
  return policy;
}

function enterSafeState(reason) {
  document.body.innerHTML = `
    <div class="safe-state">
      <h1>Marketplace Unavailable</h1>
      <p>Verification failed: ${reason}</p>
      <p>No purchases can be processed.</p>
      <p>Operator notified automatically.</p>
    </div>
  `;
  throw new Error('Safe state: ' + reason);
}
```

## CI Verification (Mandatory - MUST PASS)

```yaml
# .github/workflows/verify.yml
name: Verify Official Policy
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 * * * *'  # Hourly

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Fetch official trust document
        run: curl -sf https://reposell.dev/trust.json > trust.json
        
      - name: Verify trust document
        run: npx @reposell/verify-trust trust.json
        
      - name: Fetch official pricing policy
        run: curl -sf https://reposell.dev/pricing.json > pricing.json
        
      - name: Verify pricing policy signature
        run: npx @reposell/verify-policy pricing.json trust.json
        
      - name: Validate pricing policy
        run: |
          node -e "
            const p = require('./pricing.json');
            if (p.public_marketplace_percentage + p.main_marketplace_percentage !== 100) process.exit(1);
            const fees = calcFees(5000, p);
            if (fees.owner !== 4500 || fees.main !== 250 || fees.public !== 250) process.exit(1);
          "
          
      - name: Check no hardcoded percentages
        run: |
          if grep -r "50" src/ --include="*.js" | grep -v test | grep -v "percentage"; then
            echo "HARDCODED PERCENTAGE DETECTED!"
            exit 1
          fi
```

## Nightly Sync (Automated via CI)

```yaml
# .github/workflows/sync.yml
name: Sync Official Policy
on:
  schedule:
    - cron: '0 3 * * *'  # 3 AM daily

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Fetch latest trust document
        run: curl -sf https://reposell.dev/trust.json > public/trust.json
      - name: Fetch latest pricing policy
        run: curl -sf https://reposell.dev/pricing.json > public/pricing.json
      - name: Verify both
        run: npx @reposell/verify-all public/trust.json public/pricing.json
      - name: Commit if changed
        run: |
          git config user.name "reposell-bot"
          git config user.email "bot@reposell.dev"
          git add public/trust.json public/pricing.json
          git diff --staged --quiet || git commit -m "chore: sync official policy" && git push
```

## Stripe Connect (Static)

```javascript
// Uses pre-created connected accounts from Stripe Dashboard
// Seller IDs stored in static seller registry (JSON)

const SELLER_REGISTRY = {
  "owner/repo": "acct_1234567890",
  // ... populated at build time from official marketplace
};

// At checkout:
const session = await stripe.redirectToCheckout({
  lineItems: [{ price: priceId, quantity: 1 }],
  mode: 'payment',
  successUrl: `${origin}/purchase/success.html?session_id={CHECKOUT_SESSION_ID}`,
  cancelUrl: `${origin}/product/${productId}`,
  // Stripe Connect automatic split via connected account
});
```

## Safe State (Hard Stop)

```javascript
function enterSafeState(reason) {
  // Stop all purchase flows
  document.querySelectorAll('[data-buy-button]').forEach(btn => {
    btn.disabled = true;
    btn.textContent = 'Unavailable';
  });
  
  // Show banner
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="safe-banner" style="
      background: #fee; border: 2px solid #f88; padding: 1rem;
      color: #c00; font-weight: bold; text-align: center;
    ">
      🚨 Marketplace verification failed: ${reason}. 
      No purchases can be processed. Contact operator.
    </div>
  `);
  
  // Log for operator
  console.error('[SAFE STATE]', reason, new Date().toISOString());
}
```

## Build-Time Configuration (Embedded at Build)

```javascript
// Build script embeds official public key
const fs = require('fs');
const publicKey = fs.readFileSync('config/verification-key.pub', 'utf8').trim();

const config = {
  stripePublishableKey: 'pk_test_...',        // Embedded at build
  stripeConnectClientId: 'ca_...',             // Embedded at build
  officialPricingUrl: 'https://reposell.dev/pricing.json',
  officialTrustUrl: 'https://reposell.dev/trust.json',
  officialPublicKey: publicKey,
  pricingCacheTTL: 3600000
};

fs.writeFileSync('dist/config.js', `window.REPOSELL_CONFIG = ${JSON.stringify(config)};`);
```

## Static Hosting

```bash
# Build
npm run build

# Deploy to any static host (GitHub Pages, Netlify, Cloudflare Pages, etc.)
# No runtime environment variables - all config embedded at build time
```

**No server. No database. No Docker. No edge functions. Pure static + CI.**