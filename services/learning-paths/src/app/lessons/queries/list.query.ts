import { IQueryHandler, OffsetPagination } from '@/app/common';
import { ILessonReadRepository } from '../interfaces';
import { LessonDto } from '../dtos';

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
	constructor(private readonly lessonReadRepository: ILessonReadRepository) {}

	async execute(query: ListLessonsQuery): Promise<ListLessonsResult> {
		const lessons = await this.lessonReadRepository.list({
			where: {
				unitId: query.where?.unitId,
			},
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
		});

		return lessons;
	}
}
