docker compose -f compose.local.yaml up -d --build

docker compose exec learning-paths npm run db:push -w learning-paths
docker compose exec -d learning-paths npx drizzle-kit studio --port 5000 --verbose --host 0.0.0.0

docker compose exec progress npm run db:push -w progress