import type { IQueryHandler, OffsetPagination } from "@/app/common";
import type { LessonProgressDto } from "../dtos";
import type { ILessonProgressReadRepository } from "../interfaces";

export type ListLessonProgressQuery = {
	options?: OffsetPagination;
	where?: Partial<{
		userId: string;
		unitId: string;
	}>;
};
export type ListLessonProgressResult = LessonProgressDto[];

export class ListLessonProgressHandler
	implements IQueryHandler<ListLessonProgressQuery, ListLessonProgressResult>
{
	constructor(
		private readonly lessonProgressReadRepository: ILessonProgressReadRepository,
	) {}

	async execute(
		query: ListLessonProgressQuery,
	): Promise<ListLessonProgressResult> {
		const lessonProgress = await this.lessonProgressReadRepository.list({
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
			where: {
				unitId: query.where?.unitId,
				userId: query.where?.userId,
			},
		});

		return lessonProgress;
	}
}
