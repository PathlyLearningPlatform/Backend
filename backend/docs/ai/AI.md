# Pathly Backend - Architecture Guide

> This document describes the general architecture, philosophy, and structure for the Pathly backend.
> Use this as reference for understanding project organization and decision-making principles.
> Updated: November 29, 2025

## Quick Navigation

**New to Pathly? Start here:**

- 📋 **This file** - General architecture, folder structure, philosophy
- 🔧 **[AI-SERVICES.md](./AI-SERVICES.md)** - Services organization, communication patterns, when to add services
- 📚 **[AI-LIBS.md](./AI-LIBS.md)** - Shared libraries structure, contracts management, code generation

## Table of Contents

1. [Documentation Structure](#documentation-structure)
2. [Project Philosophy](#project-philosophy)
3. [Folder Structure](#folder-structure)
4. [Monorepo Strategy](#monorepo-strategy)
5. [Development Principles](#development-principles)

---

## Documentation Structure

This documentation is split into **three focused guides** to keep concepts organized and maintainable:

### 📋 AI.md (This File) - Architecture & Philosophy

**Covers:**

- Project philosophy and core values
- High-level folder structure
- Monorepo strategy and evolution path
- When to add new services
- Development principles

**Use when:** Understanding overall project structure, philosophy, and decision-making framework

### 🔧 [AI-SERVICES.md](./AI-SERVICES.md) - Services Guide

**Covers:**

- Service organization (domain services vs infrastructure services)
- Communication patterns (gRPC inter-service, HTTP external)
- API Gateway pattern
- Detailed guidance on adding new services

**Use when:** Creating services, understanding service structure, or learning about communication between services

### 📚 [AI-LIBS.md](./AI-LIBS.md) - Libraries Guide

**Covers:**

- Language-specific libraries (TypeScript, Rust, etc.)
- Shared library organization
- Contracts library structure and workflow
- gRPC Protocol Buffer definitions
- Code generation process

**Use when:** Working with shared code, understanding contracts, or creating new libraries

### Keeping Documentation Updated

These files should be updated whenever:

- Project structure changes
- New conventions are established
- Communication patterns evolve
- Library organization changes
- Decisions need clarification

**Context for AI Assistant:** Always reference these files when answering questions about the backend. Update them to reflect any changes you make or help implement.

---

### Core Values

**Simplicity Over Complexity**

- Keep things simple until they're not
- Avoid over-engineering for hypothetical future problems
- Use pragmatic solutions that work today

**Guidelines Over Strict Rules**

- Think of conventions as guidelines, not gospel
- Question rules if they don't fit your context
- Make informed decisions, not automatic ones

**Domain-First Organization**

- Group by business domain, not by technology
- Technology is an implementation detail
- A service is one logical unit regardless of language

**Pragmatic Scalability**

- Start with simple tools (npm, Cargo)
- Migrate to complex tooling (Nx, Turborepo) only when necessary
- Let complexity follow necessity, not speculation

---

## Folder Structure

```
backend/
├── package.json                 # npm workspace root (manages Node.js services & libs)
├── Cargo.toml                   # Cargo workspace root (manages Rust services & libs)
│
├── services/                    # Domain-organized microservices
│   ├── paths/                   # Learning paths management
│   ├── api-gateway/             # API Gateway
│   └── [service-name]/          # Future services
│
├── libs/                        # Shared code across services
│   ├── ts/                      # TypeScript shared libraries
│   │   └── common/              # Shared utilities, types, constants
│   ├── rs/                      # Rust shared libraries (when added)
│   │   └── [library-name]/
│   └── contracts/               # gRPC Protocol Buffers (language-agnostic)
│       ├── proto/
│       └── generated/
│
├── infra/                       # Infrastructure services (non-domain-specific)
│   ├── cache/                   # Cache service (e.g., Redis)
│   ├── message-broker/          # Message broker (e.g., RabbitMQ, Kafka)
│   ├── reverse-proxy/           # API gateway reverse proxy (nginx)
│   └── [other-infrastructure]/
│
├── scripts/                     # Helper scripts
│
├── compose.yaml                 # Local development orchestration
├── prod.compose.yaml            # Production orchestration
├── AI.md                        # This file - General architecture
├── AI-SERVICES.md               # Services-specific conventions
├── AI-LIBS.md                   # Libraries-specific conventions
└── [configuration files]
```

### Folder Principles

- **`services/`**: Each folder = one logical business domain/service (independently deployable)
- **`libs/`**: Shared code organized by **programming language** (except `contracts/`)
  - `ts/` → TypeScript libraries
  - `rs/` → Rust libraries
  - `contracts/` → Language-agnostic gRPC definitions (special case)
- **`infra/`**: Infrastructure services that support multiple domains (cache, queues, proxies, databases)
- **`scripts/`**: Automation and setup helpers
- **Workspace files**: `package.json` and `Cargo.toml` at root level (backend folder) to manage both services and libs

---

## Monorepo Strategy

### Current Approach (Simple)

Use **language-specific tools** for workspace management:

- **Node.js services & libs**: npm workspaces (`package.json`)
- **Rust services & libs**: Cargo workspace (`Cargo.toml`) - add when needed
- **Other languages**: Native package manager workspace files

**Why separate tools?**

- Each language has optimized tooling for its ecosystem
- Simpler to maintain than learning a new abstraction layer
- Clear separation of concerns

### Evolution Path

**Phase 1: Language-Specific Tools (Now)**

- Use npm workspaces for Node.js
- Use Cargo workspace for Rust (when added)
- Docker Compose handles service orchestration

**Phase 2: Unified Tooling (When needed)**
Migrate to Nx or Turborepo when **any** of these occur:

- Build times exceed 5-10 minutes
- Manual task coordination becomes error-prone
- CI/CD requires complex scripting
- 10+ services make local development slow
- Team size requires enforced patterns

**Key Point**: Don't migrate early. Complexity should follow necessity.

---

## Development Principles

### Flexibility Guidelines

✅ **DO:**

- Use these conventions as reference, not dogma
- Question assumptions if context suggests otherwise
- Keep tools and processes simple
- Make decisions based on current needs, not hypotheticals

❌ **DON'T:**

- Over-engineer solutions
- Create unnecessary abstractions
- Enforce rules without understanding why
- Lock into patterns prematurely

### Code Organization

- **Colocate related code** - Keep things close to where they're used
- **Shared utilities** - Extract only when used in 2+ places
- **Clear boundaries** - Services shouldn't know each other's internals
- **Language conventions** - Follow each language's idioms, not forced consistency

### Quality Standards

- **Type safety**: Leverage language type systems
- **Testing**: Unit + integration coverage where it matters
- **Code review**: Peer review before merge
- **CI/CD**: Automated checks on every push

### Git Workflow

- **Strategy**: GitHub Flow (feature branches from main)
- **Reviews**: Required before merging
- **Automation**: CI/CD runs tests on all PRs

---

## When to Add a New Service

Consider a new **domain service** when:

1. **Domain clarity** - It represents a distinct business capability
2. **Independence** - It can be developed and deployed separately
3. **Team structure** - Different team members own it
4. **Technology fit** - Using a different language makes sense for this domain
5. **Scale isolation** - It needs independent scaling

Consider a new **infrastructure service** when:

1. **Cross-domain need** - Multiple domain services need it
2. **Support concern** - It's not business logic (caching, messaging, proxying, storage)
3. **Shared versioning** - It should evolve independently from domain services

Don't create a service for:

- Code reuse (use shared libs in `libs/[language]/` instead)
- Artificial separation
- Hypothetical future features

---

**Last Updated**: November 29, 2025  
**Maintained By**: AI Assistant  
**Update Frequency**: As-needed when philosophy/structure changes

---

## Documentation References

These three files form the complete backend architecture documentation:

- **General structure**: This file (AI.md)
- **Service patterns**: [AI-SERVICES.md](./AI-SERVICES.md)
- **Library structure**: [AI-LIBS.md](./AI-LIBS.md)

**AI Assistant:** When making changes or helping with tasks, consult all three files for context and update them if conventions, patterns, or structure changes.
