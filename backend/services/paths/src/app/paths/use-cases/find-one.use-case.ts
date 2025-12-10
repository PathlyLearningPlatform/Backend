import type { FindOnePathCommand } from '@/domain/paths/commands';
import type { Path } from '@/domain/paths/entities';
import { PathNotFoundException } from '@/domain/paths/exceptions';
import type { IPathsRepository } from '@/domain/paths/interfaces';

export class FindOnePathUseCase {
	constructor(private readonly pathsRepository: IPathsRepository) {}

	async execute(command: FindOnePathCommand): Promise<Path> {
		const path = await this.pathsRepository.findOne(command);

		if (!path) {
			throw new PathNotFoundException(command.where.id);
		}

		return path;
	}
}
