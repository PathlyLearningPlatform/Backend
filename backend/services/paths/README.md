# Responsibility

Paths service responsibility is managing learning paths (creating, updating, removing and retrieving).

# Architecture

## Overview

Paths service exposes GRPC API which contracts are defined [here](/backend/libs/contracts/proto/paths/). It also uses postgres for storage.

## Code

Code is written using concepts from [DDD](https://youtu.be/4rhzdZIDX_k?si=IjC8k_rcWDTLwEQj) (Domain Driven Design) and [Clean Architecture](https://medium.com/@rudrakshnanavaty/clean-architecture-7c1b3b4cb181).

Learn more about paths service architecture [here](./docs/architecture.md)
