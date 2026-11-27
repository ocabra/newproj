# ADR-0001 — Monólito modular: Fastify + SPA React/Vite num único processo

- **Status:** aceita (27/11/2026)
- **Contexto:** 2 fundadores; o PLANO §5.1 sugere um monólito TypeScript e pede para escolher **uma** abordagem de front; a API B2B com OpenAPI é parte central do produto.
- **Decisão:** Fastify 5 serve três coisas: a API interna do portal (`/app`), a API B2B (`/api/v1`) e a SPA React/Vite já compilada. É um processo e uma imagem.
- **Alternativas:**
  - **Next.js (route handlers):** descartado. O SSR não traz ganho para telas 100% autenticadas. O OpenAPI e o rate limit por rota são menos diretos. Separar a autenticação de sessão da autenticação de máquina dá mais trabalho.
  - **NestJS:** descartado. Tem mais cerimônia (DI, decorators) sem necessidade para o tamanho do domínio.
  - **Front e API em serviços separados:** descartado. Seriam dois deploys e CORS para resolver.
- **Consequências:** o dev roda Vite (porta 5173) com proxy para o Fastify (3000); em produção, o Fastify serve `dist/web`. Se o front precisar de SEO público no futuro, o tema é reavaliado.
