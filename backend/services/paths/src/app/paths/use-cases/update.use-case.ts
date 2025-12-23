import type { UpdatePathCommand } from '@/domain/paths/commands';
import type { Path } from '@/domain/paths/entities';
import { PathNotFoundException } from '@/domain/paths/exceptions';
import type { IPathsRepository } from '@/domain/paths/interfaces';

/**
 * @description This class responsibility is to update a path. It uses paths repository for updating paths in a data source. pathsRepository in injected to this class via dependency injection and dependency inversion techniques by using IPathsRepository interface.
 */
export class UpdatePathUseCase {
	constructor(private readonly pathsRepository: IPathsRepository) {}

	/**
	 *
	 * @param command object with data for updating path
	 * @returns updated path
	 * @throws PathNotFoundException if path was not found
	 */
	async execute(command: UpdatePathCommand): Promise<Path> {
		const path = await this.pathsRepository.update(command);

		if (!path) {
			throw new PathNotFoundException(command.where.id);
		}

		return path;
	}
}
