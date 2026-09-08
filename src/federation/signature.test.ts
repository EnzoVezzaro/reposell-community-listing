import { describe, expect, it } from 'vitest';
import { createPrivateKey, generateKeyPairSync, sign } from 'node:crypto';

import {
  fetchVerifiedOfficialCatalog,
  type CatalogTextFetchResult,
} from './client.js';
import { rawPublicKeyFromPem, verifyOfficialIndex } from './signature.js';

const PKCS8_ED25519_PREFIX = Buffer.from('302e020100300506032b657004220420', 'hex');
const SPKI_ED25519_PREFIX = Buffer.from('302a300506032b6570032100', 'hex');

const keypair = generateKeyPairSync('ed25519');
const publicKeyRaw = keypair.publicKey
  .export({ type: 'spki', format: 'der' })
  .subarray(SPKI_ED25519_PREFIX.length);
const spkiPem = keypair.publicKey.export({ type: 'spki', format: 'pem' });

const INDEX_TEXT = JSON.stringify({
  updated: '2026-09-08T00:00:00.000Z',
  listings: [
    {
      product: { repository: 'seller/project', release: 'v1.0.0' },
      seller: { sell_url: 'https://seller.example/sell', payment_link: 'https://buy.stripe.com/LINK' },
      listing: { discovery_price: { amount: 5, currency: 'USD' }, stripe: { payment_link_id: 'plink_discovery' } },
    },
  ],
});

function deriveSeedFromPrivate() {
  const der = keypair.privateKey.export({ type: 'pkcs8', format: 'der' });
  return der.subarray(PKCS8_ED25519_PREFIX.length);
}

async function signIndex(indexText: string) {
  const privateKey = createPrivateKey({
    key: Buffer.concat([PKCS8_ED25519_PREFIX, deriveSeedFromPrivate()]),
    format: 'der',
    type: 'pkcs8',
  });
  return {
    schema: 'reposell-listing-index-sig/v1',
    key_id: 'key_' + 'abcdef1234567890',
    public_key: publicKeyRaw.toString('base64'),
    signature: sign(null, Buffer.from(indexText, 'utf8'), privateKey).toString('base64url'),
  };
}

const sigPayload = await signIndex(INDEX_TEXT);

describe('index signature verification (D11)', () => {
  it('verifies the exact published bytes', () => {
    expect(verifyOfficialIndex(INDEX_TEXT, sigPayload)).toBe(true);
  });

  it('verifies against a pinned official key', () => {
    expect(verifyOfficialIndex(INDEX_TEXT, sigPayload, spkiPem)).toBe(true);
  });

  it('rejects tampered index bytes', () => {
    const tampered = INDEX_TEXT.replace('v1.0.0', 'v9.9.9');
    expect(verifyOfficialIndex(tampered, sigPayload)).toBe(false);
  });

  it('rejects a wrong pinned key', () => {
    const other = generateKeyPairSync('ed25519').publicKey.export({ type: 'spki', format: 'pem' });
    expect(verifyOfficialIndex(INDEX_TEXT, sigPayload, other)).toBe(false);
  });

  it('rejects unknown schema / malformed signatures', () => {
    expect(verifyOfficialIndex(INDEX_TEXT, { ...sigPayload, schema: 'x/v1' })).toBe(false);
    expect(verifyOfficialIndex(INDEX_TEXT, { ...sigPayload, signature: '%%%' })).toBe(false);
    expect(verifyOfficialIndex(INDEX_TEXT, null)).toBe(false);
  });

  it('parses the PEM public key convention', () => {
    expect(rawPublicKeyFromPem(spkiPem)?.length).toBe(32);
    expect(rawPublicKeyFromPem('not a pem')).toBeUndefined();
  });
});

describe('fetchVerifiedOfficialCatalog (fail-closed)', () => {
  it('accepts a signed healthy catalog', async () => {
    const result = await fetchVerifiedOfficialCatalog(
      'https://listing.reposell.dev/registry/listings.json',
      async (u: string): Promise<CatalogTextFetchResult> => {
        if (u.endsWith('.sig')) return { ok: true, status: 200, text: async () => JSON.stringify(sigPayload) };
        return { ok: true, status: 200, text: async () => INDEX_TEXT };
      },
    );
    expect(result.catalog).toHaveLength(1);
    expect(result.catalog[0]?.product.repository).toBe('seller/project');
    expect(result.errors).toEqual([]);
  });

  it('fail-closed on missing signature', async () => {
    const result = await fetchVerifiedOfficialCatalog(
      'https://listing.reposell.dev/registry/listings.json',
      async (u: string): Promise<CatalogTextFetchResult> =>
        u.endsWith('.sig')
          ? { ok: false, status: 404, text: async () => '' }
          : { ok: true, status: 200, text: async () => INDEX_TEXT },
    );
    expect(result.catalog).toEqual([]);
    expect(result.errors.join()).toMatch(/signature unreachable/);
  });

  it('fail-closed on a tampered index', async () => {
    const tampered = INDEX_TEXT.replace('v1.0.0', 'v9.9.9');
    const result = await fetchVerifiedOfficialCatalog(
      'https://listing.reposell.dev/registry/listings.json',
      async (u: string): Promise<CatalogTextFetchResult> => {
        if (u.endsWith('.sig')) return { ok: true, status: 200, text: async () => JSON.stringify(sigPayload) };
        return { ok: true, status: 200, text: async () => tampered };
      },
    );
    expect(result.catalog).toEqual([]);
    expect(result.errors.join()).toMatch(/verification FAILED/);
  });
});