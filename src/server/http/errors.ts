export type ErrorCode =
  | "unauthenticated"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "validation_failed"
  | "rate_limited"
  | "csrf_failed"
  | "org_not_approved"
  | "internal";

const STATUS: Record<ErrorCode, number> = {
  unauthenticated: 401,
  forbidden: 403,
  csrf_failed: 403,
  org_not_approved: 403,
  not_found: 404,
  conflict: 409,
  validation_failed: 422,
  rate_limited: 429,
  internal: 500,
};

export class AppError extends Error {
  readonly status: number;
  constructor(
    readonly code: ErrorCode,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.status = STATUS[code];
  }
}

export const notFound = (what = "Recurso") => new AppError("not_found", `${what} não encontrado.`);
export const forbidden = (msg = "Sem permissão para esta ação.") => new AppError("forbidden", msg);
export const conflict = (msg: string, details?: unknown) => new AppError("conflict", msg, details);
export const invalid = (msg: string, details?: unknown) => new AppError("validation_failed", msg, details);
