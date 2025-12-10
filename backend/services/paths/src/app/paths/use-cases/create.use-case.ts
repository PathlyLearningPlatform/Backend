import type { CreatePathCommand } from '@/domain/paths/commands';
import type { Path } from '@/domain/paths/entities';
import type { IPathsRepository } from '@/domain/paths/interfaces';

export class CreatePathUseCase {
	constructor(private readonly pathsRepository: IPathsRepository) {}

	async execute(command: CreatePathCommand): Promise<Path> {
		return this.pathsRepository.create(command);
	}
}
