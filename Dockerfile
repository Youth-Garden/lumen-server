# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /build

# Enable pnpm
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Remove development dependencies to save space
RUN pnpm prune --prod

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Only copy necessary files from builder
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/package.json ./

# Expose port (Koyeb uses PORT env var, defaults to 3000)
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
