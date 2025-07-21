# Step 1: Install dependencies and build the Next.js app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install necessary OS deps
RUN apk add --no-cache libc6-compat

# Copy dependency definitions
COPY package.json package-lock.json* ./

# Install dependencies (legacy peer deps optional based on your note)
RUN npm install --legacy-peer-deps

# Copy the rest of the project
COPY . .

# Build the Next.js app
RUN npm run build

# Step 2: Use a minimal image for running the app
FROM node:20-alpine AS runner

# Set environment variable for production
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Copy built output and necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port your app runs on
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
