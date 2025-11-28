# Steps

In order to add new service follow the steps below:

1. Create folder inside [services](../services/) with `<service-name>` name,
2. create .env, .env.prod and .env.example files,
3. create Dockerfile,
4. if the service depends on other services for example db or cache, repeat steps 2 and 3 for them,
5. if the service depends on other services, create compose.yaml and prod.compose.yaml files,
6. in the main [compose.yaml](../compose.yaml) and [prod.compose.yaml](../prod.compose.yaml) files include created respectively compose.yaml and prod.compose.yaml files,
7. start developing the service in language or framework of your choice.

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

Each service must run in a docker container and have Dockerfile. If service has additional dependencies like database, cache or other services it should also have compose.yaml, with the service and its crucial dependencies defined. There should also be production version of the file (compose.prod.yaml) which will configure services for production (without bind mounts, using production env files).
