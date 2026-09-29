# syntax=docker/dockerfile:1
# Ölçekhane uygulama görüntüsü: Next.js bağımsız (standalone) çıktısı, root olmayan kullanıcıyla.

FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && npm run build:scripts

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN groupadd --system --gid 1001 olcekhane \
 && useradd --system --uid 1001 --gid olcekhane --no-create-home --shell /usr/sbin/nologin olcekhane
COPY --from=build --chown=olcekhane:olcekhane /app/.next/standalone ./
COPY --from=build --chown=olcekhane:olcekhane /app/.next/static ./.next/static
COPY --from=build --chown=olcekhane:olcekhane /app/public ./public
COPY --from=build --chown=olcekhane:olcekhane /app/drizzle ./drizzle
COPY --from=build --chown=olcekhane:olcekhane /app/dist ./dist
COPY --chown=olcekhane:olcekhane --chmod=755 docker/entrypoint.sh ./entrypoint.sh
USER olcekhane
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/saglik').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]
ENTRYPOINT ["./entrypoint.sh"]
