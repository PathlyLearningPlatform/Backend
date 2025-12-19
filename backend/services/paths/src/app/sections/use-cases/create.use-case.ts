import type { CreateSectionCommand } from '@/domain/sections/commands';
import type { Section } from '@/domain/sections/entities';
import type { ISectionsRepository } from '@/domain/sections/interfaces';

/**
 * @description This class responsibility is to create a section. It uses sections repository for saving sections to a data source. sectionsRepository in injected to this class via dependency injection and dependency inversion techniques by using ISectionsRepository interface.
 */
export class CreateSectionUseCase {
	constructor(private readonly sectionsRepository: ISectionsRepository) {}

	/**
	 * @param command object with data for section creation
	 * @returns created section
	 * @description this function saves section to a data source and returns it
	 */
	async execute(command: CreateSectionCommand): Promise<Section> {
		return this.sectionsRepository.create(command);
	}
}
