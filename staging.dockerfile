# Step 1: Install dependencies and build the Next.js app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install necessary OS deps
RUN apk add --no-cache libc6-compat

# Copy dependency definitions
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the project
COPY . .

# Copy environment file for frontend build
COPY .env.production .env.production

# Build the Next.js app
RUN npm run build

# Step 2: Runtime image with Chromium support
FROM node:20-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

# Install Chromium and dependencies for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Tell Puppeteer to skip installing Chrome and use the installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy only the necessary files
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Copy the EJS template
COPY --from=builder --chown=nextjs:nodejs /app/src ./src

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]