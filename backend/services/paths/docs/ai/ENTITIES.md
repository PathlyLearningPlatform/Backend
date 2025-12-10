# Entities

**Path (current only):** id, createdAt, updatedAt, name, description

Planned: Section, Unit, Item(type: EXERCISE|THEORY_BLOCK|QUIZ)

Current: simple data container (no business logic)
Future: validation methods, state transitions, domain events

Aggregate root: Path. Structure: Path → Section → Unit → Item

Domain entity ≠ persistence model (mappers pending)

