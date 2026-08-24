# feature.md — Add a new public listing feature

1. Isolate the functionality: identify the directory boundary (e.g., `src/discovery/`, `src/purchase/`).
2. Read the parent AGENTS.md to understand inheritable context.
3. Create `<dir>/AGENTS.md` (use `acc document <dir>` for a template).
4. Implement the feature following the static page/component structure.
5. Add static pages in `src/pages/`.
6. Add components in `src/components/`.
7. Run `acc check` to validate references and contracts.
8. Run `acc graph` to confirm relationships match intent.
9. Run `acc impact <dir>` to identify affected tests/dependents.
10. Update `.acc-memory.md` with what you learned.

## Sub-steps

### Page Structure

```typescript
// src/pages/ProductDetail.tsx
import { useState } from 'react';
import { StripeCheckout } from '@/components/StripeCheckout';
import { usePricingPolicy } from '@/hooks/usePricingPolicy';

export function ProductDetail({ productId }) {
  const pricing = usePricingPolicy();
  
  return (
    <div>
      <h1>Product</h1>
      <StripeCheckout 
        productId={productId}
        pricing={pricing}
      />
    </div>
  );
}
```

### Component Structure

```typescript
// src/components/StripeCheckout.tsx
import { loadStripe } from '@stripe/stripe-js';

export function StripeCheckout({ productId, pricing }) {
  const stripePromise = loadStripe(PUBLISHABLE_KEY);
  
  const handlePurchase = async () => {
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({
      lineItems: [{ price: pricing.priceId, quantity: 1 }],
      mode: 'payment',
      successUrl: `${window.location.origin}/purchase/success.html`,
      cancelUrl: `${window.location.origin}/product/${productId}`,
    });
  };
  
  return <button onClick={handlePurchase}>Pay ${pricing.amount}</button>;
}
```

### Test Structure

```typescript
// tests/integration/discovery.test.ts
import { describe, test, expect } from 'vitest';

describe('discovery', () => {
  test('discovers products from repo listing endpoints', async () => {
    // Test implementation
  });
});
```