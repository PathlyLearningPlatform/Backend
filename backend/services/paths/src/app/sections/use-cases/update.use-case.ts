import { PathNotFoundException } from '@/domain/paths/exceptions';
import { IPathsRepository } from '@/domain/paths/interfaces';
import type { UpdateSectionCommand } from '@/domain/sections/commands';
import type { Section } from '@/domain/sections/entities';
import { SectionNotFoundException } from '@/domain/sections/exceptions';
import type { ISectionsRepository } from '@/domain/sections/interfaces';

/**
 * @description This class responsibility is to update a section. It uses sections repository for updating sections in a data source. sectionsRepository in injected to this class via dependency injection and dependency inversion techniques by using ISectionsRepository interface.
 */
export class UpdateSectionUseCase {
	constructor(private readonly sectionsRepository: ISectionsRepository) {}

	/**
	 *
	 * @param command object with data for updating section
	 * @returns updated section
	 * @throws
	 * {SectionNotFoundException} if section was not found
	 */
	async execute(command: UpdateSectionCommand): Promise<Section> {
		const updatedSection = await this.sectionsRepository.update(command);

		if (!updatedSection) {
			throw new SectionNotFoundException(command.where.id);
		}

		return updatedSection;
	}
}
