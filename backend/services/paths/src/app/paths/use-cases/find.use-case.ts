import type { FindPathsCommand } from '@/domain/paths/commands';
import type { Path } from '@/domain/paths/entities';
import type { IPathsRepository } from '@/domain/paths/interfaces';

export class FindPathsUseCase {
	constructor(private readonly pathsRepository: IPathsRepository) {}

	async execute(command: FindPathsCommand): Promise<Path[]> {
		return this.pathsRepository.find(command);
	}
}
