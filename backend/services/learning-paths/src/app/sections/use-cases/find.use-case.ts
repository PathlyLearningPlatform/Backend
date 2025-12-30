import type { FindSectionsCommand } from '@/app/sections/commands';
import type { ISectionsRepository } from '@/app/sections/interfaces';
import type { Section } from '@/domain/sections/entities';

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
