# General Steps

In order to add new service follow the steps below:

1. Create folder inside [services](../services/) with `<service-name>` name,
2. create .env, .env.prod and .env.example files,
3. create Dockerfile,
4. if the service depends on other services for example db or cache, repeat steps 2 and 3 for them and create compose.yaml and prod.compose.yaml files,
5. in the main [compose.yaml](../compose.yaml) and [prod.compose.yaml](../prod.compose.yaml) files include created respectively compose.yaml and prod.compose.yaml files,
6. start developing the service in language or framework of your choice.

**Note**: Steps above are general and technology agnostic, if you want steps for specific languages / frameworks go to [Specific Technologies section](#specific-technologies)

# Specific Technologies

## Typescript

1. Delete package-lock.json and node_modules,
2. add service to the npm workspace using `npm init -w ./path/to/service`

### Nestjs

1. Move jest config from package.json to jest.config.ts
2. remove eslint and prettier
3. setup biome
4. remove unnecessary boilerplate (remove app service)
5. add /healthcheck endpoint in app controller
6. remove baseUrl from tsconfig
7. add @app path alias which points to src/*
8. add healthcheck.js file

# Explanation

## Environment

Each service must have the following env files:

- .env.example
- .env
- .env.prod

.env.example is file with example values for variables and is seen by git.
.env stores env variables for development and is ignored by git.
.env.prod stores env variables for production and is ignored by git.

## Docker

Each service must run in a docker container and have Dockerfile. If service has additional dependencies like database, cache or other services it should also have compose.yaml in order to run it in isolation (with deps). There should also be production version of the file (compose.prod.yaml) which will configure services for production (without bind mounts, using production env files).