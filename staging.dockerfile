# ---------- builder ----------
FROM node:20-bookworm-slim AS builder

# Tidak perlu lib GUI di sini
RUN apt-get update && apt-get install -y ca-certificates wget \
  && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_CACHE_DIR=/home/node/.cache/puppeteer

USER node
WORKDIR /app

COPY --chown=node:node package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Unduh Chrome for Testing (disimpan di cache Puppeteer)
RUN npx puppeteer browsers install chrome

COPY --chown=node:node . .
COPY --chown=node:node .env.production .env.production
RUN npm run build

# ---------- runner ----------
FROM node:20-bookworm-slim AS runner
ENV NODE_ENV=production
ENV PUPPETEER_CACHE_DIR=/home/node/.cache/puppeteer

# Lib runtime Chrome + font (biar karakter Latin/emoji tampil baik)
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    fonts-noto \
    fonts-noto-color-emoji \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxi6 \
    libxrandr2 \
    libgbm1 \
    libgtk-3-0 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libxshmfence1 \
  && rm -rf /var/lib/apt/lists/*

USER node
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Bawa Chrome yang sudah diunduh Puppeteer (wajib)
COPY --from=builder /home/node/.cache/puppeteer /home/node/.cache/puppeteer

EXPOSE 3000
CMD ["npm", "start"]
