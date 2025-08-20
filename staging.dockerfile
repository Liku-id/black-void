FROM node:20-bookworm-slim AS builder

ENV PUPPETEER_CACHE_DIR=/home/node/.cache/puppeteer \
    NEXT_TELEMETRY_DISABLED=1

RUN apt-get update && apt-get install -y ca-certificates \
  && rm -rf /var/lib/apt/lists/*

USER node
WORKDIR /app

COPY --chown=node:node package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

RUN npx puppeteer browsers install chrome

COPY --chown=node:node . .
COPY --chown=node:node .env.production .env.production
RUN npm run build

RUN npm prune --omit=dev


FROM node:20-bookworm-slim AS runner

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PUPPETEER_CACHE_DIR=/home/node/.cache/puppeteer \
    TMPDIR=/tmp

RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    fonts-noto \
    fonts-noto-color-emoji \
    libc6 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcairo2 \
    libcups2 \
    libdrm2 \
    libfontconfig1 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxshmfence1 \
    libxss1 \
    libgbm1 \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /tmp/chrome_ud && chown -R node:node /tmp

USER node
WORKDIR /app

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json

COPY --from=builder --chown=node:node /home/node/.cache/puppeteer /home/node/.cache/puppeteer

EXPOSE 3000
CMD ["npm", "start"]
