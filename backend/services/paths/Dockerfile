FROM node:24-slim AS base

WORKDIR /usr/src/app

COPY ./package.json ./package-lock.json ./

FROM base AS builder

# copying package.json files to install dependnecies
COPY ./libs/ts/common/package.json ./libs/ts/common/
COPY ./libs/ts/contracts/package.json ./libs/ts/contracts/
COPY ./services/paths/package.json ./services/paths/

RUN npm ci -w libs/ts/common -w libs/ts/contracts -w services/paths

# copying app and libs source code
COPY ./libs/ts/ ./libs/ts
COPY ./services/paths ./services/paths

# bulding libs and paths app only
RUN npm run build -w libs/ts/common -w libs/ts/contracts -w services/paths

FROM base AS dev

# copying node_modules from builder stage to decrease image size and speed up builds
COPY --from=builder /usr/src/app/node_modules/ ./node_modules

COPY --from=builder /usr/src/app/libs/ts/ ./libs/ts
COPY --from=builder /usr/src/app/services/paths ./services/paths

WORKDIR /usr/src/app/services/paths

CMD ["npx", "nest", "start", "--watch"]

FROM base AS prod

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/services/paths/healthcheck.js ./services/paths/

COPY --from=builder /usr/src/app/services/paths/package.json ./services/paths/
COPY --from=builder /usr/src/app/services/paths/dist ./services/paths/dist/

COPY --from=builder /usr/src/app/libs/ts/common/package.json ./libs/ts/common/
COPY --from=builder /usr/src/app/libs/ts/common/dist  ./libs/ts/common/dist/

COPY --from=builder /usr/src/app/libs/ts/contracts/package.json ./libs/ts/contracts/
COPY --from=builder /usr/src/app/libs/ts/contracts/dist  ./libs/ts/contracts/dist/

RUN npm ci --omit=dev -w libs/ts/common -w libs/ts/contracts -w services/paths

USER node

WORKDIR /usr/src/app/services/paths

CMD ["node", "./dist/src/main.js"]