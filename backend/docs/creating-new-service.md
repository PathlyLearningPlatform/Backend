# Environment

Each service must have the following env files:

- .env.example
- .env
- .env.prod

.env.example is file with example values for variables and is seen by git.
.env stores env variables for development and is ignored by git.
.env.prod stores env variables for production and is ignored by git.

# Docker

Each service must run in a docker container and have Dockerfile. If service has additional dependencies like database or cache it should also have compose.yaml, with the service and its crucial dependencies defined. There should also be production version of the file (compose.prod.yaml) which will configure services for production (without bind mounts, using production env files).
