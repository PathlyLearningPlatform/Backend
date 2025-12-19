import type { FindSectionsCommand } from '@/domain/sections/commands';
import type { Section } from '@/domain/sections/entities';
import type { ISectionsRepository } from '@/domain/sections/interfaces';

/**
 * @description This class responsibility is to find sections. It uses sections repository for retrieving sections from a data source. sectionsRepository in injected to this class via dependency injection and dependency inversion techniques by using ISectionsRepository interface.
 */
export class FindSectionsUseCase {
	constructor(private readonly sectionsRepository: ISectionsRepository) {}

	/**
	 * @param command object with data for finding sections
	 * @returns found sections
	 * @description this function retrievies sections from a data source using given command
	 */
	async execute(command: FindSectionsCommand): Promise<Section[]> {
		return this.sectionsRepository.find(command);
	}
}
