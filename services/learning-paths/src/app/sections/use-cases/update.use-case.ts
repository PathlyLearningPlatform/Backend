import type { UpdateSectionCommand } from '@/app/sections/commands';
import type { ISectionsRepository } from '@domain/sections/interfaces';
import type { Section } from '@/domain/sections/entities';
import { SectionNotFoundException } from '@/domain/sections/exceptions';
import { UniqueConstraintException } from '@pathly-backend/core/index.js';
import { SectionOrderException } from '@/domain/sections/exceptions';

export class UpdateSectionUseCase {
	constructor(private readonly sectionsRepository: ISectionsRepository) {}

	async execute(command: UpdateSectionCommand): Promise<Section> {
		try {
			const section = await this.sectionsRepository.findOne(command.where.id);

			if (!section) {
				throw new SectionNotFoundException(command.where.id);
			}

			section.update({
				description: command.fields?.description,
				name: command.fields?.name,
				order: command.fields?.order,
			});

			await this.sectionsRepository.save(section);

			return section;
		} catch (err) {
			if (err instanceof UniqueConstraintException) {
				const uniqueOrderViolation =
					err.fields.includes('order') && err.fields.includes('learningPathId');

				if (uniqueOrderViolation) {
					throw new SectionOrderException();
				}
			}

			throw err;
		}
	}
}
