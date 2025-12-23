import type { FindOnePathCommand } from '@/app/paths/commands';
import type { Path } from '@/domain/paths/entities';
import { PathNotFoundException } from '@/domain/paths/exceptions';
import type { IPathsRepository } from '@/app/paths/interfaces';

/**
 * @description This class responsibility is to find one path. It uses paths repository for retrieving path from a data source. pathsRepository in injected to this class via dependency injection and dependency inversion techniques by using IPathsRepository interface.
 */
export class FindOnePathUseCase {
	constructor(private readonly pathsRepository: IPathsRepository) {}

	/**
	 *
	 * @param command object with data for finding one path
	 * @returns found path
	 * @throws PathNotFoundException if path was not found
	 */
	async execute(command: FindOnePathCommand): Promise<Path> {
		const path = await this.pathsRepository.findOne(command);

		if (!path) {
			throw new PathNotFoundException(command.where.id);
		}

		return path;
	}
}
