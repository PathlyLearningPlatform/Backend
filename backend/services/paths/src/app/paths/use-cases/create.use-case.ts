import type { CreatePathCommand } from '@/domain/paths/commands';
import type { Path } from '@/domain/paths/entities';
import type { IPathsRepository } from '@/domain/paths/interfaces';

/**
 * @description This class responsibility is to create a path. It uses paths repository for saving paths to a data source. pathsRepository in injected to this class via dependency injection and dependency inversion techniques by using IPathsRepository interface.
 */
export class CreatePathUseCase {
	constructor(private readonly pathsRepository: IPathsRepository) {}

	/**
	 * @param command object with data for path creation
	 * @returns created path
	 * @description this function saves path to a data source and returns it
	 */
	async execute(command: CreatePathCommand): Promise<Path> {
		return this.pathsRepository.create(command);
	}
}
