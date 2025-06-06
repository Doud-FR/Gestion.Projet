FROM node:18-alpine AS builder

WORKDIR /app

# Backend build
COPY package*.json ./
RUN npm ci --only=production
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build

# Frontend build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/package*.json ./

EXPOSE 5000

CMD ["node", "dist/server.js"]
