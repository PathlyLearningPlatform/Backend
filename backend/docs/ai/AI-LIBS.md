# Pathly Backend - Libraries Guide

> This document describes the structure, purpose, and conventions for shared libraries in the Pathly backend.
> Updated: November 29, 2025

## Table of Contents

1. [Libraries Overview](#libraries-overview)
2. [Language-Specific Libraries](#language-specific-libraries)
3. [Contracts Library](#contracts-library)

---

## Libraries Overview

### Purpose

Shared libraries in `libs/` provide:
- Common utilities, types, and constants
- Language-agnostic service contracts (gRPC definitions)
- Reduced code duplication across services
- Consistency across codebase

### Structure

```
libs/
├── ts/                      # TypeScript shared libraries
│   └── common/              # Shared utilities, types, constants
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── rs/                      # Rust shared libraries (when added)
│   └── [library-name]/
│       ├── src/
│       └── Cargo.toml
└── contracts/               # gRPC Protocol Buffers (language-agnostic)
    ├── proto/
    ├── generated/
    ├── package.json
    └── buf.yaml
```

### Key Principle

Extract code to shared libraries **only when used in 2+ services**. Avoid premature abstraction.

---

## Language-Specific Libraries

### TypeScript Libraries (`libs/ts/`)

Organized by programming language and purpose.

**Current**: `libs/ts/common/`
- Shared utilities and functions
- Common types and interfaces
- Constants used across services
- Helper functions for logging, validation, etc.

**Usage**:
- Import via npm workspace: `@pathly/common`
- Access from any Node.js service

**When to add**: Create new TypeScript library when:
1. Code is used by 2+ Node.js services
2. Code represents distinct concern (validation, auth, etc.)
3. Code is stable and unlikely to change frequently

### Rust Libraries (`libs/rs/`)

Organized similarly to TypeScript libraries (when Rust services are added).

**Pattern**: Similar to TypeScript structure, but using Cargo workspace
- Reusable Rust crates
- Shared data types and traits
- Common utilities

**When to add**: Create new Rust library when:
1. Code is used by 2+ Rust services
2. Code represents distinct concern
3. Code is stable

---

## Contracts Library

### Purpose

The `libs/contracts/` library defines all inter-service communication contracts. It ensures:
- Type safety across different services and languages
- Single source of truth for API definitions
- Language-independent service integration

### Structure

```
libs/contracts/
├── proto/                       # Protocol Buffer definitions (SOURCE)
│   ├── paths/
│   │   └── paths.proto
│   ├── recommendations/
│   │   └── recommendations.proto
│   └── [domain]/
│       └── [service].proto
│
├── generated/                   # Auto-generated language-specific code (OUTPUT)
│   ├── typescript/              # Generated TypeScript code
│   │   ├── paths/
│   │   └── recommendations/
│   ├── rust/                    # Generated Rust code
│   │   ├── paths/
│   │   └── recommendations/
│   └── [other-languages]/
│
├── buf.yaml                     # Buf configuration (code generation)
├── buf.gen.yaml                 # Buf generator config
├── package.json                 # npm metadata (for TypeScript generated code)
└── README.md
```

### Workflow

1. **Define contracts**: Write `.proto` files in `proto/` directory
   - Language-agnostic Protocol Buffer 3 format
   - Describes gRPC services and message types
   - Organized by domain/service

2. **Generate code**: Run code generation for each language
   - Tools like `buf` automate generation
   - Generates TypeScript code in `generated/typescript/`
   - Generates Rust code in `generated/rust/`
   - Can be run automatically during build or manually

3. **Commit generated code**: Store generated files in version control
   - Removes runtime code generation complexity
   - Ensures build reproducibility
   - Enables offline development
   - No build-time code generation needed

4. **Use in services**: Import generated code from `@pathly/contracts`
   - Services depend on generated interfaces
   - Implement gRPC handlers with type safety
   - Changes to contracts trigger regeneration

### Key Principles

- **Proto files are source**: Only `.proto` files should be manually edited
- **Generated code is output**: Code in `generated/` is auto-generated, never manually edited
- **Commit generated files**: Committed to version control for build reliability
- **Language agnostic**: Proto definitions work across any language with gRPC support
- **Single contract source**: All services use same contract definitions

### Adding a New Contract

1. Create `.proto` file in `proto/[domain]/[service].proto`
   ```protobuf
   syntax = "proto3";
   
   package pathly.recommendations;
   
   service RecommendationsService {
     rpc GetRecommendations(GetRecommendationsRequest) returns (GetRecommendationsResponse);
   }
   
   message GetRecommendationsRequest {
     string user_id = 1;
   }
   
   message GetRecommendationsResponse {
     repeated string recommendations = 1;
   }
   ```

2. Run code generation
   ```bash
   buf generate
   ```

3. Generated code appears in `generated/typescript/`, `generated/rust/`, etc.

4. Commit all changes (`.proto` file + generated code)

5. Services import and use generated interfaces

---

**Last Updated**: November 29, 2025  
**Maintained By**: AI Assistant  
**Update Frequency**: As-needed when library conventions change

---

## Related Documentation

- **General Architecture**: See `AI.md` for overall project structure and philosophy
- **Services Guide**: See `AI-SERVICES.md` for service-specific conventions and communication patterns
