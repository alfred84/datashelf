FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate --config=libs/infrastructure/prisma/prisma.config.ts
RUN npx nx build worker --configuration=production
RUN npx nx prune worker

FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/dist/apps/worker .
RUN npm ci --omit=dev
RUN mkdir -p /app/uploads
CMD ["node", "main.js"]
