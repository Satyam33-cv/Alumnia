FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat

FROM base AS deps
COPY apps/api/package.json apps/api/package-lock.json* ./apps/api/
COPY prisma ./prisma/
WORKDIR /app/apps/api
RUN npm install --legacy-peer-deps

FROM base AS builder
WORKDIR /app
COPY apps/api ./apps/api
COPY prisma ./prisma
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
WORKDIR /app/apps/api
RUN npm run prisma:generate

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/apps/api ./apps/api
COPY --from=builder /app/prisma ./prisma

WORKDIR /app/apps/api

EXPOSE 4000
ENV PORT=4000

CMD ["sh", "-c", "npm run prisma:deploy && npm start"]
