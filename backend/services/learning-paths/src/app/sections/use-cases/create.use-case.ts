import { LearningPathNotFoundException } from '@/domain/learning-paths/exceptions';
import { ILearningPathsRepository } from '@/app/learning-paths/interfaces';
import type { CreateSectionCommand } from '@/app/sections/commands';
import type { Section } from '@/domain/sections/entities';
import type { ISectionsRepository } from '@/app/sections/interfaces';

/**
 * @description This class responsibility is to create a section. It uses sections repository for saving sections to a data source. sectionsRepository in injected to this class via dependency injection and dependency inversion techniques by using ISectionsRepository interface.
 */
export class CreateSectionUseCase {
	constructor(
		private readonly sectionsRepository: ISectionsRepository,
		private readonly learningPathsRepository: ILearningPathsRepository,
	) {}

	/**
	 * @param command object with data for section creation
	 * @returns created section
	 * @description this function saves section to a data source and returns it
	 * @throws {PathNotFoundException}
	 */
	async execute(command: CreateSectionCommand): Promise<Section> {
		const learningPath = await this.learningPathsRepository.findOne({
			where: { id: command.learningPathId },
		});

		if (!learningPath) {
			throw new LearningPathNotFoundException(command.learningPathId);
		}

		const createdSection = await this.sectionsRepository.create(command);

		return createdSection;
	}
}
