import type { IQueryHandler, OffsetPagination } from "@/app/common";
import type { LessonDto } from "../dtos";
import type { ILessonReadRepository } from "../interfaces";

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
