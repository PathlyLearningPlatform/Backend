import type { UpdateSectionCommand } from '@/app/sections/commands';
import type { ISectionsRepository } from '@/app/sections/interfaces';
import type { Section } from '@/domain/sections/entities';
import { SectionNotFoundException } from '@/domain/sections/exceptions';

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
