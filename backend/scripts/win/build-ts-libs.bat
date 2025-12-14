# build contracts and ts libs locally
npm run build -w libs/contracts -w libs/ts/common

# for docker containers
docker compose exec -w /usr/src/app paths npm run build -w libs/contracts -w libs/ts/common

docker compose exec -w /usr/src/app api-gateway npm run build -w libs/contracts -w libs/ts/common