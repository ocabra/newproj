import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

const B62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function base62(len: number): string {
  // Rejeição de viés: descarta bytes ≥ 248 (= 4 × 62).
  let out = "";
  while (out.length < len) {
    for (const b of randomBytes(len * 2)) {
      if (b < 248 && out.length < len) out += B62[b % 62];
    }
  }
  return out;
}

export interface NewApiKey {
  plaintext: string;
  prefix: string;
  secretHash: string;
}

/** Formato: rdf_<prefixo 8>_<segredo 32>. Só o prefixo e o hash do segredo são armazenados. */
export function newApiKey(): NewApiKey {
  const prefix = base62(8);
  const secret = base62(32);
  return { plaintext: `rdf_${prefix}_${secret}`, prefix, secretHash: sha256(secret) };
}

export function parseApiKey(raw: string): { prefix: string; secret: string } | null {
  const m = /^rdf_([0-9A-Za-z]{8})_([0-9A-Za-z]{32})$/.exec(raw);
  return m ? { prefix: m[1]!, secret: m[2]! } : null;
}

export function hashEquals(aHex: string, bHex: string): boolean {
  const a = Buffer.from(aHex, "hex");
  const b = Buffer.from(bHex, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
