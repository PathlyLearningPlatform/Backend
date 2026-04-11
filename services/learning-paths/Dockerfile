FROM node:24-slim AS base

WORKDIR /usr/src/app

COPY ./package.json ./package-lock.json ./

FROM base AS builder

COPY ./services/learning-paths/package.json ./services/learning-paths/

RUN npm ci -w services/learning-paths

COPY ./services/learning-paths ./services/learning-paths

# bulding libs and service code only
RUN npm run build -w services/learning-paths

FROM base AS dev

# copying node_modules from builder stage to decrease image size and speed up builds
COPY --from=builder /usr/src/app/node_modules/ ./node_modules
COPY --from=builder /usr/src/app/services/learning-paths ./services/learning-paths

WORKDIR /usr/src/app/services/learning-paths

CMD ["npx", "nest", "start", "--watch"]

FROM base AS prod

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/services/learning-paths/package.json ./services/learning-paths/
COPY --from=builder /usr/src/app/services/learning-paths/dist ./services/learning-paths/dist/

# installing dependencies for production
RUN npm ci --omit=dev -w services/learning-paths

# switching to non-root user
USER node

WORKDIR /usr/src/app/services/learning-paths

CMD ["node", "./dist/src/main.js"]