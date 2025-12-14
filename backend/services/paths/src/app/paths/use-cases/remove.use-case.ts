import type { RemovePathCommand } from '@/domain/paths/commands';
import type { Path } from '@/domain/paths/entities';
import { PathNotFoundException } from '@/domain/paths/exceptions';
import type { IPathsRepository } from '@/domain/paths/interfaces';

/**
 * @description This class responsibility is to remove a path. It uses paths repository for removing path from a data source. pathsRepository in injected to this class via dependency injection and dependency inversion techniques by using IPathsRepository interface.
 */
export class RemovePathUseCase {
	constructor(private readonly pathsRepository: IPathsRepository) {}

	/**
	 *
	 * @param command object with data for removing path
	 * @returns removed path
	 * @throws PathNotFoundException if path was not found
	 */
	async execute(command: RemovePathCommand): Promise<Path> {
		const path = await this.pathsRepository.remove(command);

		if (!path) {
			throw new PathNotFoundException(command.where.id);
		}

		return path;
	}
}
