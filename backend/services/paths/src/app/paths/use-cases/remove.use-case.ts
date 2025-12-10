import type { RemovePathCommand } from '@/domain/paths/commands';
import type { Path } from '@/domain/paths/entities';
import { PathNotFoundException } from '@/domain/paths/exceptions';
import type { IPathsRepository } from '@/domain/paths/interfaces';

export class RemovePathUseCase {
	constructor(private readonly pathsRepository: IPathsRepository) {}

	async execute(command: RemovePathCommand): Promise<Path> {
		const path = await this.pathsRepository.remove(command);

		if (!path) {
			throw new PathNotFoundException(command.where.id);
		}

		return path;
	}
}
