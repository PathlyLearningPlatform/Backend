FROM node:24-slim AS base

WORKDIR /usr/src/app

COPY ./package.json ./package-lock.json ./

FROM base AS builder

RUN npm ci

COPY . .

RUN npm run build

FROM base AS dev

# copying node_modules from builder stage to decrease image size and speed up builds
COPY --from=builder /usr/src/app/node_modules/ ./node_modules
COPY --from=builder /usr/src/app/ ./

WORKDIR /usr/src/app

CMD ["npx", "nest", "start", "--watch"]

FROM base AS prod

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/dist ./dist/

# installing dependencies for production
RUN npm ci --omit=dev

# switching to non-root user
USER node

WORKDIR /usr/src/app

CMD ["node", "./dist/src/main.js"]