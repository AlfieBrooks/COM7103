# We run this file from the root directory (see docker:build:next command in package.json)

ARG APP_DIRNAME=frontend
ARG PROJECT=frontend
ARG NODE_VERSION=20

# 1. Alpine image
FROM node:${NODE_VERSION}-alpine AS alpine
RUN apk update
RUN apk add --no-cache libc6-compat curl

# Setup pnpm and turbo on the alpine base
FROM alpine as base
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
FROM nginx:1.25.4-alpine3.18 AS runner
ARG APP_DIRNAME

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/apps/${APP_DIRNAME}/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/${APP_DIRNAME}/dist /var/www/html/

EXPOSE 3000

ENTRYPOINT ["nginx","-g","daemon off;"]
