# syntax=docker/dockerfile:1.7

# ─────────────────────────────────────────────────────────────
# Stage 1: base
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat
RUN corepack enable

WORKDIR /app

# ─────────────────────────────────────────────────────────────
# Stage 2: deps
# ─────────────────────────────────────────────────────────────
FROM base AS deps

COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/
COPY packages/config/package.json ./packages/config/

RUN --mount=type=cache,target=/root/.yarn/berry/cache,sharing=locked \
    --mount=type=cache,target=/usr/local/share/.cache/yarn,sharing=locked \
    yarn install --immutable

# ─────────────────────────────────────────────────────────────
# Stage 3: builder — gera o standalone bundle do Next
# ─────────────────────────────────────────────────────────────
FROM base AS builder

# NEXT_PUBLIC_* são inlined no build; precisa vir como build arg
ARG NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules

COPY package.json yarn.lock .yarnrc.yml turbo.json tsconfig.base.json ./
COPY apps/web ./apps/web
COPY packages/shared ./packages/shared

RUN yarn workspace @devnotes/shared build 2>/dev/null || true
RUN yarn workspace @devnotes/web build

# ─────────────────────────────────────────────────────────────
# Stage 4: runner — imagem final mínima com standalone
# ─────────────────────────────────────────────────────────────
FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 --ingroup nodejs nextjs

WORKDIR /app

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public 2>/dev/null || true

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "apps/web/server.js"]