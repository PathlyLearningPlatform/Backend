import { IQueryHandler } from '@/app/common';
import { LessonProgressDto } from '../dtos';
import { ILessonProgressReadRepository } from '../interfaces';
import { LessonProgressNotFoundException } from '../exceptions';

export type FindLessonProgressByIdQuery = {
	id: string;
};
export type FindLessonProgressByIdResult = LessonProgressDto;

export class FindLessonProgressByIdHandler
	implements
		IQueryHandler<FindLessonProgressByIdQuery, FindLessonProgressByIdResult>
{
	constructor(
		private readonly lessonProgressReadRepository: ILessonProgressReadRepository,
	) {}

	async execute(
		query: FindLessonProgressByIdQuery,
	): Promise<LessonProgressDto> {
		const lessonProgress = await this.lessonProgressReadRepository.findById(
			query.id,
		);

		if (!lessonProgress) {
			throw new LessonProgressNotFoundException(query.id);
		}

		return lessonProgress;
	}
}
