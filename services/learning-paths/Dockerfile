FROM node:24-slim AS base

WORKDIR /usr/src/app

COPY ./package.json ./package-lock.json ./

COPY --from=ghcr.io/grpc-ecosystem/grpc-health-probe:v0.4.42 /ko-app/grpc-health-probe /bin/grpc_health_probe

FROM base AS builder

# copying package.json files to install dependnecies
COPY ./libs/ts/common/package.json ./libs/ts/common/
COPY ./libs/contracts/package.json ./libs/contracts/
COPY ./services/learning-paths/package.json ./services/learning-paths/

# install dependencies required only for the service
RUN npm ci -w libs/ts/common -w libs/contracts -w services/learning-paths

# copying app and libs source code
COPY ./libs/ts/ ./libs/ts
COPY ./libs/contracts ./libs/contracts
COPY ./services/learning-paths ./services/learning-paths

# bulding libs and service code only
RUN npm run build -w libs/ts/common -w libs/contracts -w services/learning-paths

FROM base AS dev

# copying node_modules from builder stage to decrease image size and speed up builds
COPY --from=builder /usr/src/app/node_modules/ ./node_modules

COPY --from=builder /usr/src/app/libs/ts/ ./libs/ts
COPY --from=builder /usr/src/app/libs/contracts ./libs/contracts
COPY --from=builder /usr/src/app/services/learning-paths ./services/learning-paths

WORKDIR /usr/src/app/services/learning-paths

CMD ["npx", "nest", "start", "--watch"]

FROM base AS prod

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/services/learning-paths/package.json ./services/learning-paths/
COPY --from=builder /usr/src/app/services/learning-paths/dist ./services/learning-paths/dist/

COPY --from=builder /usr/src/app/libs/ts/common/package.json ./libs/ts/common/
COPY --from=builder /usr/src/app/libs/ts/common/dist  ./libs/ts/common/dist/

COPY --from=builder /usr/src/app/libs/contracts/package.json ./libs/contracts/
COPY --from=builder /usr/src/app/libs/contracts/dist/ts  ./libs/contracts/dist/ts/

# installing dependencies for production
RUN npm ci --omit=dev -w libs/ts/common -w libs/contracts -w services/learning-paths

# switching to non-root user
USER node

WORKDIR /usr/src/app/services/learning-paths

CMD ["node", "./dist/src/main.js"]