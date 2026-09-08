/**
 * Federation client (D11): community listings pull their catalog from the
 * OFFICIAL listing. Fail-closed: any fetch/parse/verification failure
 * yields an empty catalog with an explicit error — never a guessed state.
 */

import { verifyOfficialIndex } from './signature.js'

export interface FederatedListing {
  product: { repository: string; release: string };
  seller: { sell_url: string; payment_link: string };
  listing: {
    discovery_price: { amount: number; currency: string };
    stripe: { payment_link_id: string };
  };
  health?: { status: string };
}

export interface FederationResult {
  catalog: FederatedListing[];
  errors: string[];
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface CatalogFetchResult {
  ok: boolean;
  status: number;
  json: () => Promise<JsonValue>;
}

export type CatalogFetch = (url: string) => Promise<CatalogFetchResult>;

/** Text-based fetch used by the signature-verified path (raw bytes matter). */
export interface CatalogTextFetchResult {
  ok: boolean;
  status: number;
  text: () => Promise<string>;
}

export type CatalogTextFetch = (url: string) => Promise<CatalogTextFetchResult>;

function parseListings(body: { listings?: JsonValue }, errors: string[]): FederationResult {
  if (!Array.isArray(body.listings)) {
    return { catalog: [], errors: ['official catalog malformed: listings array missing'] };
  }
  const catalog: FederatedListing[] = [];
  for (const entry of body.listings) {
    // SAFETY: entry is untrusted boundary data; every consumed field is
    // type-guarded below before use.
    const candidate = entry as unknown as FederatedListing;
    const valid =
      typeof candidate?.product?.repository === 'string' &&
      typeof candidate?.seller?.sell_url === 'string' &&
      typeof candidate?.listing?.stripe?.payment_link_id === 'string';
    if (valid) catalog.push(candidate);
    else errors.push(`malformed listing entry skipped: ${JSON.stringify(entry).slice(0, 80)}`);
  }
  return { catalog, errors };
}

export async function fetchOfficialCatalog(
  officialUrl: string,
  fetchImpl: CatalogFetch,
): Promise<FederationResult> {
  const errors: string[] = [];
  try {
    const res = await fetchImpl(officialUrl);
    if (!res.ok) {
      return { catalog: [], errors: [`official catalog unreachable: HTTP ${res.status}`] };
    }
    const body = (await res.json()) as { listings?: JsonValue };
    return parseListings(body, errors);
  } catch (error) {
    return { catalog: [], errors: [`federation failed: ${error instanceof Error ? error.message : String(error)}`] };
  }
}

/**
 * Signature-verified federation (D11). Fetches the official index AND its
 * `.sig` companion over raw text, verifies the signature (optionally pinned to
 * `config/reposell/verification-key.pub`), and only then parses listings.
 * Fail-closed: any unverifiable index yields an empty catalog with an error —
 * never a guessed state.
 */
export async function fetchVerifiedOfficialCatalog(
  officialUrl: string,
  textFetchImpl: CatalogTextFetch,
  pinnedPublicKeyPem?: string,
): Promise<FederationResult> {
  const errors: string[] = [];
  try {
    const [indexRes, sigRes] = await Promise.all([
      textFetchImpl(officialUrl),
      textFetchImpl(`${officialUrl}.sig`),
    ]);
    if (!indexRes.ok) {
      return { catalog: [], errors: [`official catalog unreachable: HTTP ${indexRes.status}`] };
    }
    if (!sigRes.ok) {
      return { catalog: [], errors: [`official catalog signature unreachable: HTTP ${sigRes.status}`] };
    }
    const indexText = await indexRes.text();
    const sigText = await sigRes.text();
    let sig: unknown;
    try {
      sig = JSON.parse(sigText);
    } catch {
      return { catalog: [], errors: ['official catalog signature malformed: not JSON'] };
    }
    if (!verifyOfficialIndex(indexText, sig, pinnedPublicKeyPem)) {
      return { catalog: [], errors: ['official catalog signature verification FAILED'] };
    }
    let body: { listings?: JsonValue };
    try {
      body = JSON.parse(indexText) as { listings?: JsonValue };
    } catch {
      return { catalog: [], errors: ['official catalog malformed: not JSON'] };
    }
    return parseListings(body, errors);
  } catch (error) {
    return { catalog: [], errors: [`federation verification failed: ${error instanceof Error ? error.message : String(error)}`] };
  }
}