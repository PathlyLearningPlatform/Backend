# Repository Interface

IPathsRepository (domain-owned, infra-impl pending)

find(command: FindPathsCommand): Promise<Path[]>
findOne(command: FindOnePathCommand): Promise<Path | null>
create(command: CreatePathCommand): Promise<Path>
update(command: UpdatePathCommand): Promise<Path | null>
remove(command: RemovePathCommand): Promise<Path | null>

Key: returns domain entities only, never DB models
Mappers: domain ↔ persistence (not impl yet)
DI: @Inject(DiToken.PATHS_REPOSITORY)

