import { invalid } from "../http/errors.js";

/** Cursor opaco: base64url de "<created_at ISO>|<uuid>". */
export function encodeCursor(createdAt: Date, id: string): string {
  return Buffer.from(`${createdAt.toISOString()}|${id}`).toString("base64url");
}

export function decodeCursor(cursor: string | undefined): { createdAt: Date; id: string } | null {
  if (!cursor) return null;
  const raw = Buffer.from(cursor, "base64url").toString("utf8");
  const [iso, id] = raw.split("|");
  const d = new Date(iso ?? "");
  if (!id || Number.isNaN(d.getTime()) || !/^[0-9a-f-]{36}$/.test(id))
    throw invalid("Cursor inválido.", { field: "cursor" });
  return { createdAt: d, id };
}
