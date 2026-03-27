FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate --config=libs/infrastructure/prisma/prisma.config.ts
RUN npx nx build api --configuration=production
RUN npx nx prune api

FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/dist/apps/api .
RUN npm ci --omit=dev
RUN mkdir -p /app/uploads
COPY --from=builder /app/libs/infrastructure/prisma libs/infrastructure/prisma
COPY --from=builder /app/node_modules/.prisma node_modules/.prisma
COPY --from=builder /app/node_modules/prisma node_modules/prisma
COPY --from=builder /app/node_modules/@prisma node_modules/@prisma
COPY --from=builder /app/apps/api/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]
