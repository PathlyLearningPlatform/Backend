# Pathly Backend - Services Guide

> This document describes conventions, communication patterns, and organization for services in the Pathly backend.
> Updated: November 29, 2025

## Table of Contents

1. [Service Organization](#service-organization)
2. [Communication Patterns](#communication-patterns)
3. [When to Add a Service](#when-to-add-a-service)

---

## Service Organization

### Service as Domain Unit

Each service in `services/[name]/` represents:

- One primary business domain
- One or more deployable artifacts
- Potential use of multiple languages (gradually migrate, not mix)

### Examples

```
services/
├── paths/               # Paths service (Node.js)
├── api-gateway/         # API Gateway (Node.js)
├── recommendations/     # Recommendations (could be Node.js or Rust)
└── analytics/           # Analytics (could be Node.js or Rust)
```

### Domain Services vs Infrastructure Services

**Domain Services** (`services/` folder):

- Implement business logic for a specific domain
- Independently deployable and scalable
- Communicate via gRPC with other services
- Examples: `paths`, `recommendations`, `analytics`

**Infrastructure Services** (`infra/` folder):

- Support multiple domain services (non-domain-specific)
- Handle cross-cutting concerns (caching, messaging, proxying)
- Shared by multiple services
- Examples: Redis (cache), RabbitMQ (message broker), nginx (reverse proxy)

### Service Independence

- Each domain service is **independently deployable**
- Services communicate via **well-defined contracts** (gRPC)
- Shared code lives in `libs/[language]/`, not duplicated
- Infrastructure services are shared and versioned separately

### Dependency Boundaries

- Keep `domain/` framework-agnostic (no Nest DI/modules/decorators).
- Framework-named but framework-agnostic utilities are OK in `domain/`.
	- Example: `@nestjs/mapped-types` is treated as a normal npm library when used only for TypeScript type/DTO helpers.

---

## Communication Patterns

### Inter-Service Communication

- **Protocol**: gRPC with Protocol Buffers
- **Location**: Contract definitions in `libs/contracts/proto/`
- **Type safety**: Generated code ensures type-safe communication
- **Principle**: Contracts are shared; implementations are separate

**Flow**:

```
Service A → gRPC call → Service B
(using shared contract definition)
```

### External Communication (HTTP)

- **Entry point**: `api-gateway` service
- **Protocol**: HTTP/REST for external clients
- **Reverse proxy**: nginx (in `infra/reverse-proxy/`)
- **Pattern**: External clients → HTTP/nginx → api-gateway → gRPC → internal services

**Flow**:

```
External Client → HTTP → nginx (reverse proxy) → api-gateway service → gRPC → internal services
```

### API Gateway Pattern

The `api-gateway` service:

- Accepts HTTP requests from external clients
- Translates HTTP calls to internal gRPC calls
- Routes requests to appropriate internal services
- Handles authentication, rate limiting, logging
- Single entry point for all external traffic

---

## When to Add a Service

### Add a New Domain Service When:

1. **Domain clarity** - It represents a distinct business capability
2. **Independence** - It can be developed and deployed separately
3. **Team structure** - Different team members own it
4. **Technology fit** - Using a different language makes sense for this domain
5. **Scale isolation** - It needs independent scaling

### Add a New Infrastructure Service When:

1. **Cross-domain need** - Multiple domain services need it
2. **Support concern** - It's not business logic (caching, messaging, proxying, storage)
3. **Shared versioning** - It should evolve independently from domain services

### Don't Create a Service For:

- Code reuse (use shared libs in `libs/[language]/` instead)
- Artificial separation
- Hypothetical future features

---

**Last Updated**: November 29, 2025  
**Maintained By**: AI Assistant  
**Update Frequency**: As-needed when service conventions change

---

## Related Documentation

- **General Architecture**: See `AI.md` for overall project structure and philosophy
- **Libraries Guide**: See `AI-LIBS.md` for shared library organization and contracts
