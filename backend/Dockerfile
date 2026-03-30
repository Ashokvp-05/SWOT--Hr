# Use a specific Node.js version as base image
FROM node:18-alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
# Use npm ci for exact matches based on package-lock.json
RUN npm ci

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma Client (crucial for type-safe database queries)
RUN npx prisma generate
# Build the TypeScript application
RUN npm run build

# Stage 3: Runner
FROM base AS runner
# Install runtime dependencies ONLY
RUN apk add --no-cache openssl netcat-openbsd
WORKDIR /app

ENV NODE_ENV production

# Copy necessary artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh

# Ensure entrypoint is executable
RUN chmod +x entrypoint.sh

# Expose backend port
EXPOSE 4000

# Use the entrypoint script
ENTRYPOINT ["./entrypoint.sh"]
