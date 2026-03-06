import { ICommandHandler, SectionNotFoundException } from '@/app/common';
import { ILearningPathRepository } from '@/domain/learning-paths/interfaces';
import { LearningPathId } from '@/domain/learning-paths/value-objects';
import { ISectionRepository } from '@/domain/sections/interfaces';
import { LearningPathNotFoundException } from '@app/common';
import { SectionId } from '@/domain/sections/value-objects/id.vo';

type RemoveSectionFromLearningPathCommand = {
	learningPathId: string;
	sectionId: string;
};

export class RemoveSectionFromLearningPathHandler
	implements ICommandHandler<RemoveSectionFromLearningPathCommand, void>
{
	constructor(
		private readonly learningPathRepository: ILearningPathRepository,
		private readonly sectionRepository: ISectionRepository,
	) {}

	async execute(command: RemoveSectionFromLearningPathCommand): Promise<void> {
		const learningPathId = LearningPathId.create(command.learningPathId);
		const learningPath = await this.learningPathRepository.load(learningPathId);

		if (!learningPath) {
			throw new LearningPathNotFoundException(command.learningPathId);
		}

		const sectionId = SectionId.create(command.sectionId);
		const section = await this.sectionRepository.load(sectionId);

		if (!section) {
			throw new SectionNotFoundException(sectionId.value);
		}

		learningPath.removeSection(sectionId);
		section.ensureCanRemove();

		await this.sectionRepository.remove(sectionId);
		await this.learningPathRepository.save(learningPath);
	}
}
