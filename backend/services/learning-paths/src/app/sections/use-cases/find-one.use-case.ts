import type { FindOneSectionCommand } from '@/app/sections/commands';
import type { ISectionsRepository } from '@/app/sections/interfaces';
import type { Section } from '@/domain/sections/entities';
import { SectionNotFoundException } from '@/domain/sections/exceptions';

/**
 * @description This class responsibility is to find one section. It uses sections repository for retrieving section from a data source. sectionsRepository in injected to this class via dependency injection and dependency inversion techniques by using ISectionsRepository interface.
 */
export class FindOneSectionUseCase {
	constructor(private readonly sectionsRepository: ISectionsRepository) {}

	/**
	 *
	 * @param command object with data for finding one section
	 * @returns found section
	 * @throws SectionNotFoundException if section was not found
	 */
	async execute(command: FindOneSectionCommand): Promise<Section> {
		const section = await this.sectionsRepository.findOne(command);

		if (!section) {
			throw new SectionNotFoundException(command.where.id);
		}

		return section;
	}
}
