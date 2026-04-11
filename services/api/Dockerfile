FROM node:24-slim AS base

WORKDIR /usr/src/app

COPY ./package.json ./package-lock.json ./

FROM base AS builder

COPY ./services/api/package.json ./services/api/

RUN npm ci -w services/api

COPY ./services/api ./services/api

# bulding libs and service code only
RUN npm run build -w services/api

FROM base AS dev

# copying node_modules from builder stage to decrease image size and speed up builds
COPY --from=builder /usr/src/app/node_modules/ ./node_modules
COPY --from=builder /usr/src/app/services/api ./services/api

WORKDIR /usr/src/app/services/api

CMD ["npx", "nest", "start", "--watch"]

FROM base AS prod

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/services/api/package.json ./services/api/
COPY --from=builder /usr/src/app/services/api/dist ./services/api/dist/

# installing dependencies for production
RUN npm ci --omit=dev -w services/api

# switching to non-root user
USER node

WORKDIR /usr/src/app/services/api

CMD ["node", "./dist/src/main.js"]