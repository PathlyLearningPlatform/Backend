FROM nginx:1.29-alpine AS base

COPY ./nginx.conf /etc/nginx/

FROM base AS dev

RUN apk add curl

FROM base AS prod