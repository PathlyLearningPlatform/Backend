import { randomUUID } from "crypto";
import type { ICommandHandler } from "@/app/common";
import { UUID } from "@/domain/common";
import type { ILearningPathRepository } from "@/domain/learning-paths";
import { LearningPath } from "@/domain/learning-paths/learning-path.aggregate";
import { LearningPathId } from "@/domain/learning-paths/value-objects";
import type { LearningPathDto } from "../dtos";

type CreateLearningPathCommand = {
	name: string;
	description?: string | null;
};
type CreateLearningPathResult = LearningPathDto;

export class CreateLearningPathHandler
	implements
		ICommandHandler<CreateLearningPathCommand, CreateLearningPathResult>
{
	constructor(
		private readonly learningPathRepository: ILearningPathRepository,
	) {}

	async execute(
		command: CreateLearningPathCommand,
	): Promise<CreateLearningPathResult> {
		const id = LearningPathId.create(UUID.create(randomUUID()));

		const learningPath = LearningPath.create(id, {
			name: command.name,
			createdAt: new Date(),
			description: command.description,
		});

		await this.learningPathRepository.save(learningPath);

		return {
			id: learningPath.id.toString(),
			createdAt: learningPath.createdAt,
			updatedAt: learningPath.updatedAt ?? null,
			name: learningPath.name.value,
			description: learningPath.description
				? learningPath.description.value
				: null,
			sectionCount: learningPath.sectionCount,
		};
	}
}
