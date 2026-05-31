# What This Repository

This repository is a backend for Pathly written in Nestjs and Typescript.

# How to run

## Development

### Linux

- open project root directory in terminal of your choice
- run `./scripts/linux/start.local.sh`

### Windows

- open project root directory in terminal of your choice
- run `.\scripts\win\start.local.bat`

## Production

### Linux

- open project root directory in terminal of your choice
- run `./scripts/linux/start.sh`

### Windows

- open project root directory in terminal of your choice
- run `.\scripts\win\start.bat`

# Services

## Development

After starting the backend in development mode following services will be available:

| Service         | URL                        | Technology   |
| --------------- | -------------------------- | ------------ |
| db              | http://localhost:5432      | postgres     |
| graph-db        | http://localhost:7474      | neo4j        |
| auth            | http://localhost:8080      | keycloak     |
| api             | http://localhost:3000      | nodejs       |
| reverse-proxy   | http://localhost:4000      | nginx        |

### Api

Swagger UI: http://localhost:3000/docs

JSON OpenApi Spec: http://localhost:3000/docs/json

YAML OpenApi Spec: http://localhost:3000/docs/yaml