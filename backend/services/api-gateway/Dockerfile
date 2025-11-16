FROM node:24-slim AS base

WORKDIR /usr/src/app

COPY ./package.json ./package-lock.json ./

FROM base AS builder

# copying package.json files to install dependnecies
COPY ./libs/ts/common/package.json ./libs/ts/common/
COPY ./libs/ts/contracts/package.json ./libs/ts/contracts/
COPY ./services/api-gateway/package.json ./services/api-gateway/

RUN npm ci -w libs/ts/common -w libs/ts/contracts -w services/api-gateway

# copying app and libs source code
COPY ./libs/ts/ ./libs/ts
COPY ./services/api-gateway ./services/api-gateway

# bulding libs and api-gateway app only
RUN npm run build -w libs/ts/common -w libs/ts/contracts -w services/api-gateway

FROM base AS dev

# copying node_modules from builder stage to decrease image size and speed up builds
COPY --from=builder /usr/src/app/node_modules/ ./node_modules

COPY --from=builder /usr/src/app/libs/ts/ ./libs/ts
COPY --from=builder /usr/src/app/services/api-gateway ./services/api-gateway

WORKDIR /usr/src/app/services/api-gateway

CMD ["npx", "nest", "start", "--watch"]

FROM base AS prod

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/services/api-gateway/healthcheck.js ./services/api-gateway/

COPY --from=builder /usr/src/app/services/api-gateway/package.json ./services/api-gateway/
COPY --from=builder /usr/src/app/services/api-gateway/dist ./services/api-gateway/dist/

COPY --from=builder /usr/src/app/libs/ts/common/package.json ./libs/ts/common/
COPY --from=builder /usr/src/app/libs/ts/common/dist  ./libs/ts/common/dist/

COPY --from=builder /usr/src/app/libs/ts/contracts/package.json ./libs/ts/contracts/
COPY --from=builder /usr/src/app/libs/ts/contracts/dist  ./libs/ts/contracts/dist/

RUN npm ci --omit=dev -w libs/ts/common -w libs/ts/contracts -w services/api-gateway

USER node

WORKDIR /usr/src/app/services/api-gateway

CMD ["node", "./dist/src/main.js"]