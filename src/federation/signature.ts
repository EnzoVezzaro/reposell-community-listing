/**
 * Federation signature verification (D11).
 *
 * The official listing signs the EXACT bytes of its published registry index
 * (`/registry/listings.json`) with the RepoSell official Ed25519 key. The
 * signature is published alongside it at `.../listings.json.sig` as
 * `reposell-listing-index-sig/v1` and is self-describing (schema, key id,
 * public key, signature).
 *
 * The official public key MAY also be pinned to
 * `config/reposell/verification-key.pub` (SPKI PEM); when present it is
 * compared against the key embedded in the signature payload.
 *
 * Fail-closed: any malformed/mismatched signature returns false.
 */

import { createPublicKey, verify } from 'node:crypto';

export const INDEX_SIG_SCHEMA = 'reposell-listing-index-sig/v1' as const;

const SPKI_ED25519_PREFIX = Buffer.from('302a300506032b6570032100', 'hex');

export interface IndexSigPayload {
  schema?: string;
  key_id?: string;
  public_key?: string;
  signature?: string;
}

export function rawPublicKeyFromPem(pem: string): Buffer | undefined {
  const base64 = pem
    .split(/\r?\n/)
    .filter((line) => line.length > 0 && !line.startsWith('-----'))
    .join('');
  const der = Buffer.from(base64, 'base64');
  if (der.length !== SPKI_ED25519_PREFIX.length + 32 || !der.subarray(0, SPKI_ED25519_PREFIX.length).equals(SPKI_ED25519_PREFIX)) {
    return undefined;
  }
  return der.subarray(SPKI_ED25519_PREFIX.length);
}

/** Verifies a signature payload against the exact served index bytes. */
export function verifyOfficialIndex(
  indexText: string,
  sigPayload: unknown,
  pinnedPublicKeyPem?: string,
): boolean {
  const sig = sigPayload as IndexSigPayload | null;
  if (sig?.schema !== INDEX_SIG_SCHEMA) return false;
  if (typeof sig.signature !== 'string' || typeof sig.public_key !== 'string') return false;
  try {
    const embedded = Buffer.from(sig.public_key, 'base64');
    if (embedded.length !== 32) return false;
    if (pinnedPublicKeyPem !== undefined) {
      const expected = rawPublicKeyFromPem(pinnedPublicKeyPem);
      if (expected === undefined || !expected.equals(embedded)) return false;
    }
    const publicKey = createPublicKey({
      key: Buffer.concat([SPKI_ED25519_PREFIX, embedded]),
      format: 'der',
      type: 'spki',
    });
    const signature = Buffer.from(sig.signature, 'base64url');
    return verify(null, Buffer.from(indexText, 'utf8'), publicKey, signature);
  } catch {
    return false;
  }
}