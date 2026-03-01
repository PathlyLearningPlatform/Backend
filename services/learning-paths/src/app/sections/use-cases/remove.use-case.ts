import { InvalidReferenceException } from '@pathly-backend/core/index.js';
import type { ISectionsRepository } from '@domain/sections/interfaces';
import {
	SectionCannotBeRemovedException,
	SectionNotFoundException,
} from '@/domain/sections/exceptions';
import { ILearningPathsRepository } from '@/domain/learning-paths/interfaces';
import { LearningPath } from '@/domain/learning-paths/entities';

export class RemoveSectionUseCase {
	constructor(
		private readonly sectionsRepository: ISectionsRepository,
		private readonly learningPathsRepository: ILearningPathsRepository,
	) {}

	async execute(id: string): Promise<void> {
		try {
			const section = await this.sectionsRepository.remove(id);

			if (!section) {
				throw new SectionNotFoundException(id);
			}

			// learning path will never be null, because section cannot be created with learningPathId that doesnt exist
			const learningPath = (await this.learningPathsRepository.findOne(
				section.learningPathId,
			)) as LearningPath;

			learningPath.update({
				sectionCount: learningPath.sectionCount - 1,
			});

			await this.learningPathsRepository.save(learningPath);
		} catch (err) {
			if (err instanceof InvalidReferenceException) {
				throw new SectionCannotBeRemovedException(id);
			}

			throw err;
		}
	}
}
