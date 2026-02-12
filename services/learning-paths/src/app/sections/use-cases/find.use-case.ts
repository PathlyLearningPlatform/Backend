import type { FindSectionsCommand } from '@/app/sections/commands';
import type { ISectionsRepository } from '@domain/sections/interfaces';
import type { Section } from '@/domain/sections/entities';

export class FindSectionsUseCase {
	constructor(private readonly sectionsRepository: ISectionsRepository) {}

	async execute(command: FindSectionsCommand): Promise<Section[]> {
		return this.sectionsRepository.find(command);
	}
}
