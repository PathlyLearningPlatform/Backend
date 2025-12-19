# Paths Service - AI Context

DDD + Clean Architecture. Domain Model: Path (AR) → Section → Unit → Item (EXERCISE|THEORY_BLOCK|QUIZ)

**Current State:**
- src/domain/paths/
  - entities/path.entity.ts: id, createdAt, updatedAt, name, description
  - commands/: Create, Update, Remove, Find, FindOne
  - interfaces/repository.interface.ts: IPathsRepository (domain-owned)
  - enums/item-type.enum.ts
- src/infra/db/: DB service, schemas, config (repository impl pending)
- src/app/: empty

**Architecture:**
- Inward dependency: infra → domain → app (app not impl yet)
- Domain entities ≠ persistence models (mappers not yet impl)
- Repository interface returns domain entities only
- Commands use `@nestjs/mapped-types` for DRY (treated as a normal npm utility lib; TS-only type helpers)
- Find commands empty, ready for filtering/sorting/pagination
