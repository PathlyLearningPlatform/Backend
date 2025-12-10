import type { UpdatePathComand } from '@/domain/paths/commands';
import type { Path } from '@/domain/paths/entities';
import { PathNotFoundException } from '@/domain/paths/exceptions';
import type { IPathsRepository } from '@/domain/paths/interfaces';

export class UpdatePathUseCase {
	constructor(private readonly pathsRepository: IPathsRepository) {}

	async execute(command: UpdatePathComand): Promise<Path> {
		const path = await this.pathsRepository.update(command);

		if (!path) {
			throw new PathNotFoundException(command.where.id);
		}

		return path;
	}
}
