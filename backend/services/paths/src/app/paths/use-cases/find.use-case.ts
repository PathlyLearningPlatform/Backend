import type { FindPathsCommand } from '@/domain/paths/commands';
import type { Path } from '@/domain/paths/entities';
import type { IPathsRepository } from '@/domain/paths/interfaces';

/**
 * @description This class responsibility is to find paths. It uses paths repository for retrieving paths from a data source. pathsRepository in injected to this class via dependency injection and dependency inversion techniques by using IPathsRepository interface.
 */
export class FindPathsUseCase {
	constructor(private readonly pathsRepository: IPathsRepository) {}

	/**
	 * @param command object with data for finding paths
	 * @returns found paths
	 * @description this function retrievies paths from a data source using given command
	 */
	async execute(command: FindPathsCommand): Promise<Path[]> {
		return this.pathsRepository.find(command);
	}
}
