# Overview

Backend consists of several components:

- libraries
- services
- scripts
- documentation

## Libraries

Libraries are shared code used by many services. They contain pure utils (like emptyStringToNull function) as well as framework / library specific code (like nestjs interceptors). Backend can be written in many programming languages so libs folder contains subfolder for every language that is used in backend. Example structure would look like this:

backend
-libs
-- ts
-- rust
-- go

Contracts library will be exception, because it will be located directly in libs folder, because contracts will be written in language agnostic format.

## Services

Services are actual domain apps that serve specific purpose, for example paths services is responsible for learning paths. They can use libraries. Services can also communicate with each other, so there are contracts, which define what messages service can handle and what is returns.

## Scripts

Scripts are helpers mainly used for automating things like creating .env files (they need to be created by the developer, because they are ignored by git).

## Documentation

Backend services communicate in different ways and they can handle different requests. Often one request goes through many services. Backend also has certain architecture. Those things will be documented precisely so they can be understood clearly.

# Setup process

1. Create npm workspace
2. Create services, libs, scripts and docs folders
3. Create typescript projects inside services folder, by using npm init or dedicated cli
4. Delete node_modules and package-lock.json files from created projects
5. Link created projects to the npm workspace
6. Create libraries
7. Link created libraries to the npm workspace
