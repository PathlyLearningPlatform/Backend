docker compose -f compose.local.yaml up -d --build

docker compose -f compose.local.yaml exec api npm run db:migrate -w api