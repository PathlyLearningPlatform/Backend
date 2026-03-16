import { IQueryHandler } from '@/app/common';
import { LearningPathProgressDto } from '../dtos';
import { ILearningPathProgressReadRepository } from '../interfaces';
import { LearningPathProgressNotFoundException } from '../exceptions';

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
		const lessonProgress = await this.lessonProgressReadRepository.findForUser(
			query.learningPathId,
			query.userId,
		);

		if (!lessonProgress) {
			throw new LearningPathProgressNotFoundException('');
		}

		return lessonProgress;
	}
}
