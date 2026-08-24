import { describe, expect, it } from 'vitest';

import { fetchOfficialCatalog } from './federation/client.js';
import { renderCatalogPage, renderListingPage, validateFrontendOutput } from './frontend/render.js';

const listing = {
  product: { repository: 'seller/project', release: 'v2.4.1' },
  seller: { sell_url: 'https://seller.example/sell', payment_link: 'https://buy.stripe.com/SELLER_LINK' },
  listing: {
    discovery_price: { amount: 5, currency: 'USD' },
    stripe: { payment_link_id: 'plink_discovery' },
  },
  health: { status: 'healthy' },
};

describe('federation client (fail-closed)', () => {
  it('parses a healthy official catalog', async () => {
    const result = await fetchOfficialCatalog('https://listing.reposell.dev/index.json', async () => ({
      ok: true,
      status: 200,
      json: async () => ({ listings: [listing] }),
    }));
    expect(result.catalog).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
  });

  it('fail-closed on unreachable official catalog', async () => {
    const result = await fetchOfficialCatalog('https://listing.reposell.dev/index.json', async () => ({
      ok: false,
      status: 500,
      json: async () => ({}),
    }));
    expect(result.catalog).toHaveLength(0);
    expect(result.errors[0]).toContain('unreachable');
  });

  it('skips malformed entries with explicit errors', async () => {
    const result = await fetchOfficialCatalog('x', async () => ({
      ok: true,
      status: 200,
      json: async () => ({ listings: [listing, { broken: true }] }),
    }));
    expect(result.catalog).toHaveLength(1);
    expect(result.errors).toHaveLength(1);
  });
});

describe('frontend generator (§9-§12)', () => {
  it('renders discovery CTA with allowed wording and a separate seller section', () => {
    const html = renderListingPage(listing);
    expect(html).toContain('Unlock discovery');
    expect(html).toContain('data-seller-transaction="independent"');
    expect(html).toContain('https://seller.example/sell');
    const check = validateFrontendOutput(html);
    expect(check.ok).toBe(true);
  });

  it('never contains forbidden CTA wording or secrets', () => {
    const poisoned = {
      ...listing,
      product: { repository: 'Buy software now</script>', release: 'v1.0.0' },
      listing: { ...listing.listing, stripe: { payment_link_id: 'sk_test_51Hx' } },
    };
    const html = renderListingPage(poisoned);
    const check = validateFrontendOutput(html);
    expect(check.ok).toBe(false); // forbidden CTA wording from the poisoned name
    // The renderer never emits Stripe ids at all — a leaked secret is
    // dropped on the floor, not rendered.
    expect(html).not.toContain('sk_test_51Hx');
    expect(html).not.toContain('plink_discovery');
    expect(html).not.toContain('<script>');
  });

  it('catalog page lists products and surfaces federation errors', () => {
    const html = renderCatalogPage([listing], ['official catalog unreachable: HTTP 500']);
    expect(html).toContain('seller/project');
    expect(html).toContain('unreachable');
  });
});
