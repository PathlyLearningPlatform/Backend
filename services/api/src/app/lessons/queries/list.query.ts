import type { IQueryHandler, OffsetPagination } from '@/app/common';
import type { LessonDto } from '../dtos';
import { ILessonRepository } from '@/domain/lessons';
import { aggregateToDto } from '../helpers';

type ListLessonsQuery = {
	where?: {
		unitId?: string;
	};
	options?: OffsetPagination;
};
type ListLessonsResult = LessonDto[];

export class ListLessonsHandler
	implements IQueryHandler<ListLessonsQuery, ListLessonsResult>
{
	constructor(private readonly lessonRepository: ILessonRepository) {}

	async execute(query: ListLessonsQuery): Promise<ListLessonsResult> {
		const lessons = await this.lessonRepository.list({
			where: {
				unitId: query.where?.unitId,
			},
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
		});

		return lessons.map(aggregateToDto);
	}
}
