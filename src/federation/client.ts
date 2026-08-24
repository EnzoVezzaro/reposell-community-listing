/**
 * Federation client (D11): community listings pull their catalog from the
 * OFFICIAL listing. Fail-closed: any fetch/parse/verification failure
 * yields an empty catalog with an explicit error — never a guessed state.
 */

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
  } catch (error) {
    return { catalog: [], errors: [`federation failed: ${error instanceof Error ? error.message : String(error)}`] };
  }
}
