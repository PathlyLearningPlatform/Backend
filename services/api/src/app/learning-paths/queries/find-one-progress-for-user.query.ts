import type { IQueryHandler } from "@/app/common";
import type { LearningPathProgressDto } from "../dtos";
import { LearningPathProgressNotFoundException } from "../exceptions";
import type { ILearningPathProgressReadRepository } from "../interfaces";

export type FindLearningPathProgressForUserQuery = {
	learningPathId: string;
	userId: string;
};
export type FindLearningPathProgressForUserResult = LearningPathProgressDto;

export class FindLearningPathProgressForUserHandler
	implements
		IQueryHandler<
			FindLearningPathProgressForUserQuery,
			FindLearningPathProgressForUserResult
		>
{
	constructor(
		private readonly lessonProgressReadRepository: ILearningPathProgressReadRepository,
	) {}

	async execute(
		query: FindLearningPathProgressForUserQuery,
	): Promise<LearningPathProgressDto> {
		const lessonProgress =
			await this.lessonProgressReadRepository.findOneForUser(
				query.learningPathId,
				query.userId,
			);

		if (!lessonProgress) {
			throw new LearningPathProgressNotFoundException("");
		}

		return lessonProgress;
	}
}
