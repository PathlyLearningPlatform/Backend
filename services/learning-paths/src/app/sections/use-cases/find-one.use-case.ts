import type { ISectionsRepository } from '@/app/sections/interfaces';
import type { Section } from '@/domain/sections/entities';
import { SectionNotFoundException } from '@/domain/sections/exceptions';

export class FindOneSectionUseCase {
	constructor(private readonly sectionsRepository: ISectionsRepository) {}

	async execute(id: string): Promise<Section> {
		const section = await this.sectionsRepository.findOne(id);

		if (!section) {
			throw new SectionNotFoundException(id);
		}

		return section;
	}
}
