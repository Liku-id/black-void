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
# Make sure .env.production exists in repo or generated before build
COPY .env.production .env.production

# Build the Next.js app
RUN npm run build

# Step 2: Use a minimal image for running the app
FROM node:20-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

# Copy only the necessary files
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown node:node .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

ENV PORT=3000
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]


