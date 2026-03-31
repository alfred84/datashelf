FROM node:24-alpine AS builder
WORKDIR /app
ENV DATABASE_URL="postgresql://datashelf:datashelf@postgres:5432/datashelf?schema=public"
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate --config=libs/infrastructure/prisma/prisma.config.ts
RUN npx nx build worker --configuration=production
RUN npx nx prune worker
RUN cd dist/apps/worker && npm install --omit=dev

FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/dist/apps/worker .
COPY --from=builder /app/libs/infrastructure/prisma libs/infrastructure/prisma
RUN addgroup -S appgroup \
  && adduser -S appuser -G appgroup \
  && mkdir -p /app/uploads \
  && chown -R appuser:appgroup /app
USER appuser
CMD ["node", "main.js"]
