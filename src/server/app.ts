import cookie from "@fastify/cookie";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { sql } from "drizzle-orm";
import Fastify, { type FastifyInstance } from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Config } from "./config.js";
import type { Db } from "./db/client.js";
import { AppError } from "./http/errors.js";
import { registerAppRoutes } from "./http/app/routes.js";
import { registerV1Routes } from "./http/v1/routes.js";
import { API_DESCRIPTION } from "./http/v1/schemas.js";
import type { Principal } from "./services/principal.js";

declare module "fastify" {
  interface FastifyRequest {
    principal: Principal | null;
  }
  interface FastifyInstance {
    db: Db;
    config: Config;
  }
}

export const VERSION = "0.1.0";

export interface BuildOptions {
  db: Db;
  config: Config;
  logger?: boolean;
  /** Limites de taxa (sobrescrevíveis em teste). */
  rateLimits?: { apiPerMinute: number; loginPerMinute: number };
}

export async function buildApp(opts: BuildOptions): Promise<FastifyInstance> {
  const app = Fastify({
    logger: opts.logger
      ? {
          level: "info",
          redact: ["req.headers.authorization", "req.headers.cookie", "res.headers['set-cookie']"],
        }
      : false,
    bodyLimit: 1_100_000,
    trustProxy: opts.config.NODE_ENV === "production",
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.decorate("db", opts.db);
  app.decorate("config", opts.config);
  app.decorateRequest("principal", null);

  // CSV entra como texto puro, com limite próprio.
  app.addContentTypeParser("text/csv", { parseAs: "string", bodyLimit: 1_000_000 }, (_req, body, done) =>
    done(null, body),
  );

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
      },
    },
  });
  await app.register(cookie);
  await app.register(rateLimit, {
    global: false,
    errorResponseBuilder: (_req, ctx) => ({
      statusCode: 429,
      error: { code: "rate_limited", message: `Limite de requisições excedido. Tente de novo em ${ctx.after}.` },
    }),
  });

  await app.register(swagger, {
    openapi: {
      openapi: "3.1.0",
      info: { title: "Radar de Fornecedores — API B2B", version: "1.0.0", description: API_DESCRIPTION },
      servers: [{ url: "/" }],
      components: {
        securitySchemes: {
          apiKey: { type: "http", scheme: "bearer", bearerFormat: "rdf_<prefixo>_<segredo>" },
        },
      },
      security: [{ apiKey: [] }],
    },
    transform: jsonSchemaTransform,
  });
  await app.register(swaggerUi, { routePrefix: "/api/docs" });

  app.setErrorHandler((err, req, reply) => {
    if (hasZodFastifySchemaValidationErrors(err)) {
      return reply.status(422).send({
        error: {
          code: "validation_failed",
          message: "Dados inválidos.",
          details: err.validation.map((v) => ({ path: v.instancePath, message: v.message })),
        },
      });
    }
    if (err instanceof AppError) {
      return reply.status(err.status).send({ error: { code: err.code, message: err.message, details: err.details } });
    }
    const status = (err as { statusCode?: number }).statusCode;
    if (status === 429) return reply.status(429).send(err);
    if (status && status >= 400 && status < 500) {
      return reply.status(status).send({ error: { code: "bad_request", message: (err as Error).message } });
    }
    req.log.error({ err }, "erro não tratado");
    return reply.status(500).send({ error: { code: "internal", message: "Erro interno." } });
  });

  app.get("/health", { schema: { hide: true } }, async (_req, reply) => {
    try {
      await opts.db.execute(sql`select 1`);
      return { status: "ok", db: "ok", version: VERSION };
    } catch {
      return reply.status(503).send({ status: "degraded", db: "unreachable", version: VERSION });
    }
  });

  const limits = opts.rateLimits ?? { apiPerMinute: 120, loginPerMinute: 10 };
  await app.register(async (scope) => registerAppRoutes(scope, limits), { prefix: "/app" });
  await app.register(async (scope) => registerV1Routes(scope, limits), { prefix: "/api/v1" });

  // SPA compilada (produção). Em desenvolvimento, o Vite serve o front e faz proxy.
  const here = path.dirname(fileURLToPath(import.meta.url));
  const webDir = [path.resolve(here, "../../web"), path.resolve(here, "../../dist/web")].find((d) =>
    fs.existsSync(path.join(d, "index.html")),
  );
  if (webDir) {
    await app.register(fastifyStatic, { root: webDir, wildcard: false });
    app.setNotFoundHandler((req, reply) => {
      if (req.method === "GET" && !req.url.startsWith("/api") && !req.url.startsWith("/app")) {
        return reply.sendFile("index.html");
      }
      return reply.status(404).send({ error: { code: "not_found", message: "Rota não encontrada." } });
    });
  } else {
    app.setNotFoundHandler((_req, reply) =>
      reply.status(404).send({ error: { code: "not_found", message: "Rota não encontrada." } }),
    );
  }

  return app;
}
