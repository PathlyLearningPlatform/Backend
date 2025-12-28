# Overview

Whole source code is inside the [src](../src/) folder.

# Structure

There are 3 main folder, which divide the service into layers:

- domain
- app (application)
- infra (infrastructure)

Dependency direction goes from top to bottom: Infrastructure depends on application and application depends on domain. Domain depends only on the core typescript and javascript features (no external libraries).

## Domain

The `domain` folder contains folders named after specific entities