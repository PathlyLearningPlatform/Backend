import {
	type ICommandHandler,
	LearningPathNotFoundException,
	SectionNotFoundException,
} from '@/app/common';
import { Order } from '@/domain/common';
import type { ILearningPathRepository } from '@/domain/learning-paths';
import type { ISectionRepository } from '@/domain/sections/repositories';
import { SectionId } from '@/domain/sections/value-objects/id.vo';

type ReorderSectionCommand = {
	sectionId: string;
	order: number;
};

export class ReorderSectionHandler
	implements ICommandHandler<ReorderSectionCommand, void>
{
	constructor(
		private readonly learningPathRepository: ILearningPathRepository,
		private readonly sectionsRepository: ISectionRepository,
	) {}

	async execute(command: ReorderSectionCommand): Promise<void> {
		const sectionId = SectionId.create(command.sectionId);
		const section = await this.sectionsRepository.load(sectionId);

		if (!section) {
			throw new SectionNotFoundException(command.sectionId);
		}

		const learningPath = await this.learningPathRepository.load(
			section.learningPathId,
		);

		// never going to happen
		// only for type safety
		if (!learningPath) {
			throw new LearningPathNotFoundException(
				section.learningPathId.toString(),
			);
		}

		const order = Order.create(command.order);
		const newOrder = learningPath.reorderSection(sectionId, order);

		// never going to happen
		// only for type safety
		if (!newOrder) {
			throw new SectionNotFoundException(section.id.value);
		}

		section.update(new Date(), { order: newOrder });
		learningPath.update(new Date());

		await this.sectionsRepository.save(section);
		await this.learningPathRepository.save(learningPath);
	}
}
