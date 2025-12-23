import { PathNotFoundException } from '@/domain/paths/exceptions';
import { IPathsRepository } from '@/app/paths/interfaces';
import type { CreateSectionCommand } from '@/app/sections/commands';
import type { Section } from '@/domain/sections/entities';
import type { ISectionsRepository } from '@/app/sections/interfaces';

/**
 * @description This class responsibility is to create a section. It uses sections repository for saving sections to a data source. sectionsRepository in injected to this class via dependency injection and dependency inversion techniques by using ISectionsRepository interface.
 */
export class CreateSectionUseCase {
	constructor(
		private readonly sectionsRepository: ISectionsRepository,
		private readonly pathsRepository: IPathsRepository,
	) {}

	/**
	 * @param command object with data for section creation
	 * @returns created section
	 * @description this function saves section to a data source and returns it
	 * @throws {PathNotFoundException}
	 */
	async execute(command: CreateSectionCommand): Promise<Section> {
		const path = await this.pathsRepository.findOne({
			where: { id: command.pathId },
		});

		if (!path) {
			throw new PathNotFoundException(command.pathId);
		}

		const createdSection = await this.sectionsRepository.create(command);

		return createdSection;
	}
}
