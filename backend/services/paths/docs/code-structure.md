# Overview

Paths service uses concepts from clean architecture (CA) as well as domain driven design (DDD). Service will be divided into 3 distinct layers: domain -> application -> infrastructure. Domain layer will contain core business rules (for example path entity). Application layer will depend on domain layer and will contain business logic (for example path creation). Infrastructure layer will use framework and external libraries to make application work. It will contain controllers, repositories and integreations with external services if needed. Each layer will also contain modules for dealing with specific domain. For example application layer will have modules for dealing with paths, projects, exercises etc.

# Dependency direction

domain layer -> application layer -> infrastructure layer