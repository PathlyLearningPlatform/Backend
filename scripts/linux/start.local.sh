docker compose -f compose.local.yaml up -d --build

docker compose exec learning-paths npm run db:push -w learning-paths
docker compose exec progress npm run db:push -w progress