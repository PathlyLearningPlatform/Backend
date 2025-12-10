# Commands

CreatePathCommand: name, description?
UpdatePathCommand: where.id, fields? (Partial<Path>)
RemovePathCommand: where.id
FindPathsCommand: {} (ready for filtering/sorting)
FindOnePathCommand: {} (ready for id param)

Returns: Path, Path|null, Path[], Promise
Naming: [Action][Entity]Command
Pattern: @nestjs/mapped-types for DRY

