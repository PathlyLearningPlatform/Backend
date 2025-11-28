# build contracts and ts libs locally
npm run build -w libs/contracts -w libs/ts/common

# for docker containers
docker compose exec paths npm run build -w contracts -w common