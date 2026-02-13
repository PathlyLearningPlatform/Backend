import { randomUUID } from 'crypto';
import type { ILearningPathsRepository } from '@/domain/learning-paths/interfaces';
import type { CreateSectionCommand } from '@/app/sections/commands';
import type { ISectionsRepository } from '@domain/sections/interfaces';
import { LearningPathNotFoundException } from '@/domain/learning-paths/exceptions';
import { Section } from '@/domain/sections/entities';
import { UniqueConstraintException } from '@pathly-backend/core/index.js';
import { SectionOrderException } from '@/domain/sections/exceptions';

export class CreateSectionUseCase {
	constructor(
		private readonly sectionsRepository: ISectionsRepository,
		private readonly learningPathsRepository: ILearningPathsRepository,
	) {}

	async execute(command: CreateSectionCommand): Promise<Section> {
		try {
			const learningPath = await this.learningPathsRepository.findOne(
				command.learningPathId,
			);

			if (!learningPath) {
				throw new LearningPathNotFoundException(command.learningPathId);
			}

			const section = new Section({
				id: randomUUID(),
				learningPathId: command.learningPathId,
				createdAt: new Date(),
				updatedAt: new Date(),
				name: command.name,
				order: command.order,
				description: command.description ?? null,
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
