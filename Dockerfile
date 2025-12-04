FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy uploads folder (jika ada)
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Health check using node instead of wget
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Start application
CMD ["node", "dist/server.js"]