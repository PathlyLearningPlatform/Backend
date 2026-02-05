import type { UpdateSectionCommand } from '@/app/sections/commands';
import type { ISectionsRepository } from '@/app/sections/interfaces';
import type { Section } from '@/domain/sections/entities';
import { SectionNotFoundException } from '@/domain/sections/exceptions';

export class UpdateSectionUseCase {
	constructor(private readonly sectionsRepository: ISectionsRepository) {}

	async execute(command: UpdateSectionCommand): Promise<Section> {
		const section = await this.sectionsRepository.findOne(command.where.id);

		if (!section) {
			throw new SectionNotFoundException(command.where.id);
		}

		section.update({
			description: command.fields?.description,
			name: command.fields?.name,
			order: command.fields?.order,
		});

		return section;
	}
}
