docker compose up -d --build

docker compose exec paths npm run db:push -w paths
docker compose exec -d paths npx drizzle-kit studio --port 5000 --verbose --host 0.0.0.0