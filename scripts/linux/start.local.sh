docker compose -f compose.local.yaml up -d --build

docker compose -f compose.local.yaml exec learning-paths npm run db:migrate -w learning-paths
docker compose -f compose.local.yaml exec progress npm run db:migrate -w progress