# Responsibility

Paths service covers learning paths subdomain and is responsible for paths, projects, exercises and quizzes.

# Architecture

Paths service exposes GRPC API which contracts are defined [here](/backend/libs/contracts/proto/paths/). It also uses postgres for storage.

Learn more about paths service architecture [here](./docs/architecture.md)

# Project structure

[Project structure docs](./docs/project-structure.md)

# Code

Code is written using concepts from [DDD](https://youtu.be/4rhzdZIDX_k?si=IjC8k_rcWDTLwEQj) (Domain Driven Design) and [Clean Architecture](https://medium.com/@rudrakshnanavaty/clean-architecture-7c1b3b4cb181).

More on code structure [here](./docs/code.md)
