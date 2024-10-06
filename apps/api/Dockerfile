# We run this file from the root directory (see docker:build:next command in package.json)

ARG APP_DIRNAME=api
ARG PROJECT=api
ARG NODE_VERSION=20

# 1. Alpine image
FROM node:${NODE_VERSION}-alpine AS alpine
RUN apk update
RUN apk add --no-cache libc6-compat curl

# Setup pnpm and turbo on the alpine base
FROM alpine AS base
RUN corepack enable
RUN npm install turbo --global
RUN pnpm config set store-dir ~/.pnpm-store

# 2. Prune projects
FROM base AS pruner
ARG PROJECT

WORKDIR /app
COPY . .
RUN turbo prune --scope=${PROJECT} --docker

# 3. Build the project
FROM base AS builder
ARG PROJECT

WORKDIR /app

# Copy lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# First install the dependencies (as they change less often)
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install

# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .

RUN turbo build --filter=${PROJECT}
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm prune --prod --no-optional
RUN rm -rf ./**/*/src

# 4. Production dependencies
FROM builder AS dependencies
WORKDIR /app
RUN pnpm --filter=$PROJECT deploy --prod --ignore-scripts --no-optional /dependencies

# 5. Final image - runner stage to run the application
FROM alpine AS runner
ARG APP_DIRNAME
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder --chown=nodejs:nodejs /app/apps/${APP_DIRNAME} .
COPY --from=dependencies --chown=nodejs:nodejs /dependencies/node_modules ./node_modules

CMD ["node", "/app/dist/index.js"]
