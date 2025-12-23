import type { RemovePathCommand } from '@/app/paths/commands';
import type { Path } from '@/domain/paths/entities';
import {
	PathCannotBeRemovedException,
	PathNotFoundException,
} from '@/domain/paths/exceptions';
import type { IPathsRepository } from '@/app/paths/interfaces';
import { InvalidReferenceException } from '@pathly-backend/common/index.js';

/**
 * @description This class responsibility is to remove a path. It uses paths repository for removing path from a data source. pathsRepository in injected to this class via dependency injection and dependency inversion techniques by using IPathsRepository interface.
 */
export class RemovePathUseCase {
	constructor(private readonly pathsRepository: IPathsRepository) {}

	/**
	 *
	 * @param command object with data for removing path
	 * @returns removed path
	 * @throws
	 * {PathNotFoundException} if path was not found
	 * {PathCannotBeRemovedException} if path has sections
	 */
	async execute(command: RemovePathCommand): Promise<Path> {
		try {
			const path = await this.pathsRepository.remove(command);

			if (!path) {
				throw new PathNotFoundException(command.where.id);
			}

			return path;
		} catch (err) {
			if (err instanceof InvalidReferenceException) {
				throw new PathCannotBeRemovedException(command.where.id);
			}

			throw err;
		}
	}
}
