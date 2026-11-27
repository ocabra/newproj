# Imagem única do protótipo (docs/09 §6). Build: podman build -t radar . ; requer DATABASE_URL em runtime.
FROM docker.io/library/node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM docker.io/library/node:24-alpine
WORKDIR /app
ENV NODE_ENV=production API_HOST=0.0.0.0 PORT=3000
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/package.json ./
USER node
EXPOSE 3000
HEALTHCHECK CMD wget -qO- http://127.0.0.1:3000/health || exit 1
CMD ["sh", "-c", "node dist/node/server/db/migrate.js && node dist/node/server/main.js"]
