import type {
	CreatePathCommand,
	FindOnePathCommand,
	FindPathsCommand,
	RemovePathCommand,
	UpdatePathComand,
} from '@/domain/paths/commands';
import type { Path } from '@/domain/paths/entities';

export interface IPathsRepository {
	find(command: FindPathsCommand): Promise<Path[]>;
	findOne(command: FindOnePathCommand): Promise<Path | null>;
	create(command: CreatePathCommand): Promise<Path>;
	update(command: UpdatePathComand): Promise<Path | null>;
	remove(command: RemovePathCommand): Promise<Path | null>;
}
