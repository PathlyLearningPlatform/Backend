import type {
	CreatePathCommand,
	FindOnePathCommand,
	FindPathsCommand,
	RemovePathCommand,
	UpdatePathCommand,
} from '@/domain/paths/commands';
import type { Path } from '@/domain/paths/entities';

/**
 * This interface represents a class which task is to retrieve or add paths from / to a data source. It only tells what data is needed and what data is returned (it is datasource agnostic). Concrete path repositories should implement this interface.
 */
export interface IPathsRepository {
	find(command: FindPathsCommand): Promise<Path[]>;
	findOne(command: FindOnePathCommand): Promise<Path | null>;
	create(command: CreatePathCommand): Promise<Path>;
	update(command: UpdatePathCommand): Promise<Path | null>;
	remove(command: RemovePathCommand): Promise<Path | null>;
}
