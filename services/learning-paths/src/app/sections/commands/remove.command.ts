import { ICommandHandler, SectionNotFoundException } from '@/app/common';
import { ILearningPathRepository } from '@/domain/learning-paths/interfaces';
import { ISectionRepository } from '@/domain/sections/interfaces';
import { LearningPathNotFoundException } from '@app/common';
import { SectionId } from '@/domain/sections/value-objects/id.vo';

type RemoveSectionCommand = {
	sectionId: string;
};

export class RemoveSectionHandler
	implements ICommandHandler<RemoveSectionCommand, void>
{
	constructor(
		private readonly learningPathRepository: ILearningPathRepository,
		private readonly sectionRepository: ISectionRepository,
	) {}

	async execute(command: RemoveSectionCommand): Promise<void> {
		const sectionId = SectionId.create(command.sectionId);
		const section = await this.sectionRepository.load(sectionId);

		if (!section) {
			throw new SectionNotFoundException(sectionId.value);
		}

		const learningPath = await this.learningPathRepository.load(
			section.learningPathId,
		);

		// never going to happen
		// only for type safety
		if (!learningPath) {
			throw new LearningPathNotFoundException(section.learningPathId.value);
		}

		section.ensureCanRemove();
		learningPath.removeSection(sectionId);

		await this.sectionRepository.remove(sectionId);
		await this.learningPathRepository.save(learningPath);
	}
}
