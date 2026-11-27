import { hash, verify } from "@node-rs/argon2";

// Parâmetros Argon2id próximos da recomendação OWASP (m=19 MiB, t=2, p=1).
const OPTS = { memoryCost: 19_456, timeCost: 2, parallelism: 1 } as const;

export const hashPassword = (pw: string) => hash(pw, OPTS);
export const verifyPassword = (hashed: string, pw: string) => verify(hashed, pw).catch(() => false);

// Hash fixo usado quando o e-mail não existe, para igualar o tempo de resposta do login.
let dummy: string | undefined;
export async function dummyVerify(pw: string): Promise<void> {
  dummy ??= await hashPassword("senha-inexistente-para-tempo-constante");
  await verifyPassword(dummy, pw);
}
