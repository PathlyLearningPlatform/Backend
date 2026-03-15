import { IQueryHandler } from '@/app/common';
import { LessonProgressDto } from '../dtos';
import { ILessonProgressReadRepository } from '../interfaces';
import { LessonProgressNotFoundException } from '../exceptions';

export type FindLessonProgressForUserQuery = {
	lessonId: string;
	userId: string;
};
export type FindLessonProgressForUserResult = LessonProgressDto;

export class FindLessonProgressForUserHandler
	implements
		IQueryHandler<
			FindLessonProgressForUserQuery,
			FindLessonProgressForUserResult
		>
{
	constructor(
		private readonly lessonProgressReadRepository: ILessonProgressReadRepository,
	) {}

	async execute(
		query: FindLessonProgressForUserQuery,
	): Promise<LessonProgressDto> {
		const lessonProgress = await this.lessonProgressReadRepository.findForUser(
			query.lessonId,
			query.userId,
		);

		if (!lessonProgress) {
			throw new LessonProgressNotFoundException('');
		}

		return lessonProgress;
	}
}
