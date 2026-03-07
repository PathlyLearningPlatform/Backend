import { ICommandHandler } from '@/app/common';
import { ILearningPathRepository } from '@/domain/learning-paths/interfaces';
import { LearningPathId } from '@/domain/learning-paths/value-objects';
import { ISectionRepository } from '@/domain/sections/interfaces';
import { Section } from '@/domain/sections/section.aggregate';
import {
	SectionDescription,
	SectionName,
} from '@/domain/sections/value-objects';
import { SectionId } from '@/domain/sections/value-objects/id.vo';
import { randomUUID } from 'node:crypto';
import { LearningPathNotFoundException } from '@app/common';
import { SectionDto } from '@/app/sections/dtos';
import { Order } from '@/domain/common';

type AddSectionCommand = {
	learningPathId: string;
	name: string;
	description?: string | null;
};
type AddSectionResult = SectionDto;

export class AddSectionHandler
	implements ICommandHandler<AddSectionCommand, AddSectionResult>
{
	constructor(
		private readonly learningPathRepository: ILearningPathRepository,
		private readonly sectionRepository: ISectionRepository,
	) {}

	async execute(command: AddSectionCommand): Promise<AddSectionResult> {
		const id = LearningPathId.create(command.learningPathId);
		const learningPath = await this.learningPathRepository.load(id);

		if (!learningPath) {
			throw new LearningPathNotFoundException(id.value);
		}

		const sectionId = SectionId.create(randomUUID());
		const sectionRef = learningPath.addSection(sectionId);
		const sectionName = SectionName.create(command.name);
		const sectionDescription =
			command.description != null
				? SectionDescription.create(command.description)
				: null;

		const section = Section.create(sectionRef.sectionId, {
			createdAt: new Date(),
			learningPathId: id,
			name: sectionName,
			description: sectionDescription,
			order: sectionRef.order,
		});

		learningPath.update(new Date());

		await this.sectionRepository.save(section);
		await this.learningPathRepository.save(learningPath);

		return {
			id: section.id.value,
			createdAt: section.createdAt,
			learningPathId: section.learningPathId.value,
			description: section.description?.value ?? null,
			name: section.name.value,
			updatedAt: section.updatedAt ?? null,
			order: section.order.value,
			unitCount: section.unitCount,
		};
	}
}
