#!/bin/sh

# generate contracts locally
npm run gen -w libs/contracts

# for docker containers
docker compose exec -w /usr/src/app learning-paths npm run gen -w libs/contracts

docker compose exec -w /usr/src/app progress npm run gen -w libs/contracts

docker compose exec -w /usr/src/app api-gateway npm run gen -w libs/contracts

docker compose exec -w /usr/src/app skills npm run gen -w libs/contracts