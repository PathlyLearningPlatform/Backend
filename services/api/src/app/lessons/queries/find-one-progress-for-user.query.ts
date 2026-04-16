import type { IQueryHandler } from '@/app/common';
import type { LessonProgressDto } from '../dtos';
import { LessonProgressNotFoundException } from '../exceptions';
import {
	ILessonProgressRepository,
	LessonId,
	LessonProgressId,
} from '@/domain/lessons';
import { UserId, UUID } from '@/domain/common';
import { progressAggregateToDto } from '../helpers';

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
		private readonly lessonProgressRepository: ILessonProgressRepository,
	) {}

	async execute(
		query: FindLessonProgressForUserQuery,
	): Promise<LessonProgressDto> {
		const progressId = LessonProgressId.create(
			LessonId.create(query.lessonId),
			UserId.create(UUID.create(query.userId)),
		);
		const lessonProgress =
			await this.lessonProgressRepository.findById(progressId);

		if (!lessonProgress) {
			throw new LessonProgressNotFoundException('');
		}

		return progressAggregateToDto(lessonProgress);
	}
}
