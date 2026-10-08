# syntax=docker/dockerfile:1
# Ölçekhane uygulama görüntüsü: Next.js bağımsız (standalone) çıktısı, root olmayan kullanıcıyla.
# Uygulama hiçbir şey saklamaz: veritabanı yoktur; kapsayıcı salt okunur dosya sistemiyle çalışır
# (bkz. docker-compose.yml).

FROM node:22-bookworm-slim AS deps
WORKDIR /app
# .npmrc: onnxruntime-node (transformers.js'in sitede kullanılmayan bağımlılığı) GPU dosyalarını indirmesin.
COPY package.json package-lock.json .npmrc ./
RUN npm ci --no-audit --no-fund

# Sesli okumada otomatik analiz: konuşma tanıma modeli (~250 MB) Hugging Face'ten sabit sürümüyle indirilir ve SHA-256
# ile doğrulanır. Bu aşama yalnızca betiğe bağlıdır: betik değişmedikçe katman önbellekten gelir, model yeniden inmez.
FROM node:22-bookworm-slim AS model
WORKDIR /app
COPY araclar/model-hazirla.mjs ./araclar/
RUN node araclar/model-hazirla.mjs --model

FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# ONNX Runtime Web ve transformers.js'in tarayıcı dosyaları node_modules'tan public/ altına (ort/, vendor/).
RUN node araclar/model-hazirla.mjs --calisma && npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN groupadd --system --gid 1001 olcekhane \
 && useradd --system --uid 1001 --gid olcekhane --no-create-home --shell /usr/sbin/nologin olcekhane
# Model, uygulamadan önce kopyalanır: her derlemede değişen katmanlardan önce durduğu için önbellekten gelir.
COPY --from=model --chown=olcekhane:olcekhane /app/public/model ./public/model
COPY --from=build --chown=olcekhane:olcekhane /app/.next/standalone ./
COPY --from=build --chown=olcekhane:olcekhane /app/.next/static ./.next/static
COPY --from=build --chown=olcekhane:olcekhane /app/public ./public
# Next.js'in önbellek klasörü: kapsayıcıda bellekte duran geçici bir klasör (tmpfs) buraya bağlanır.
RUN install -d -o olcekhane -g olcekhane /app/.next/cache
USER olcekhane
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/saglik').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]
CMD ["node", "server.js"]
