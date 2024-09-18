FROM node:20-alpine AS base

FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat

WORKDIR /app
RUN npm i -g turbo@^2
COPY . .
RUN turbo prune image-generator --docker

FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN corepack enable
RUN pnpm install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm dlx turbo run build --filter=image-generator...

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 node_group
RUN adduser --system --uid 1001 node_user
USER node_user

COPY --from=installer /app .

CMD ["node", "apps/image-generator/dist/index.js"]
