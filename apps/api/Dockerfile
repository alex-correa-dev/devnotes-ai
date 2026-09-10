# syntax=docker/dockerfile:1.7

# ─────────────────────────────────────────────────────────────
# Stage 1: base — shared runtime deps
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat
RUN corepack enable

WORKDIR /app

# ─────────────────────────────────────────────────────────────
# Stage 2: deps — instala dependências com cache do BuildKit
# ─────────────────────────────────────────────────────────────
FROM base AS deps

COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
COPY packages/config/package.json ./packages/config/

RUN --mount=type=cache,target=/root/.yarn/berry/cache,sharing=locked \
    --mount=type=cache,target=/usr/local/share/.cache/yarn,sharing=locked \
    yarn install --immutable

# ─────────────────────────────────────────────────────────────
# Stage 3: builder — compila TypeScript
# ─────────────────────────────────────────────────────────────
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules 2>/dev/null || true
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules 2>/dev/null || true

COPY package.json yarn.lock .yarnrc.yml turbo.json tsconfig.base.json ./
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared

RUN yarn workspace @devnotes/shared build 2>/dev/null || true
RUN yarn workspace @devnotes/api build

# ─────────────────────────────────────────────────────────────
# Stage 4: runner — imagem final mínima
# ─────────────────────────────────────────────────────────────
FROM base AS runner

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 --ingroup nodejs nodejs

WORKDIR /app

# Apenas dependências de produção
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/packages/shared/src ./packages/shared/src
COPY --chown=nodejs:nodejs apps/api/package.json ./package.json

USER nodejs

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "dist/main.js"]