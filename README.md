# Overview

Backend consists of several components:

- libraries
- services
- scripts
- documentation

## Libraries

Libraries are shared code used by many services. Backend can be written in many programming languages so libs folder contains subfolder for every language that is used. Example structure would look like this:

backend

-libs

-- ts

-- rust

-- go

Contracts library is the exception as it is located directly in libs folder, because contracts are written in language agnostic format.

## Services

Services are actual domain apps that serve specific purpose. Services can use shared libraries.

## Scripts

Scripts are just helpers for better developer experience.

## Documentation

Architecture, important decisions are presicely described. Documentation consists of markdown files in the [docs](./docs/) folder and README.md files located across whole repoisitory.

# Startup

## Development

In order to run backend in development mode run [start.sh](./scripts/linux/start.sh) script (or [start.bat](./scripts/win/start.bat) for windows) or run `npm run start` command.

## Production

In order to run backend in production mode run [start-prod.sh](./scripts/linux/start-prod.sh) or run `npm run start` command.

**Note**: Npm scripts run linux scripts, so if you are on windows you have to run scripts manually.

**Hint**: If you are not a developer or you just want to run backend in order to use it run it in production mode, because it is faster and takes up less space.

# For Developers

If you are a backend developer see [dev guide](./docs/dev/dev-guide.md).

[Collaboration](./collaboration.md)

[git](./git.md)
