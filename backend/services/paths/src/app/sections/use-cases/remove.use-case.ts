import type { RemoveSectionCommand } from '@/domain/sections/commands';
import type { Section } from '@/domain/sections/entities';
import { SectionNotFoundException } from '@/domain/sections/exceptions';
import type { ISectionsRepository } from '@/domain/sections/interfaces';

/**
 * @description This class responsibility is to remove a section. It uses sections repository for removing section from a data source. sectionsRepository in injected to this class via dependency injection and dependency inversion techniques by using ISectionsRepository interface.
 */
export class RemoveSectionUseCase {
	constructor(private readonly sectionsRepository: ISectionsRepository) {}

	/**
	 *
	 * @param command object with data for removing section
	 * @returns removed section
	 * @throws SectionNotFoundException if section was not found
	 */
	async execute(command: RemoveSectionCommand): Promise<Section> {
		const section = await this.sectionsRepository.remove(command);

		if (!section) {
			throw new SectionNotFoundException(command.where.id);
		}

		return section;
	}
}
