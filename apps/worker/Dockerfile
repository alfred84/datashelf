FROM node:24-alpine AS builder
WORKDIR /app
ENV DATABASE_URL="postgresql://datashelf:datashelf@postgres:5432/datashelf?schema=public"
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate --config=libs/infrastructure/prisma/prisma.config.ts
RUN npx nx build worker --configuration=production
RUN npx nx prune worker

FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/dist/apps/worker .
RUN rm -f package-lock.json && npm install --omit=dev
RUN mkdir -p /app/uploads
CMD ["node", "main.js"]
