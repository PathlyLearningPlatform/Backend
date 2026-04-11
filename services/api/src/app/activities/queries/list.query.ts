import type { IQueryHandler, OffsetPagination } from "@/app/common";
import type { ActivityDto } from "../dtos";
import type { IActivityReadRepository } from "../interfaces";

type ListActivitiesQuery = {
	where?: {
		lessonId?: string;
	};
	options?: OffsetPagination;
};
type ListActivitiesResult = ActivityDto[];

export class ListActivitiesHandler
	implements IQueryHandler<ListActivitiesQuery, ListActivitiesResult>
{
	constructor(
		private readonly activityReadRepository: IActivityReadRepository,
	) {}

	async execute(query: ListActivitiesQuery): Promise<ListActivitiesResult> {
		return this.activityReadRepository.list({
			where: {
				lessonId: query.where?.lessonId,
			},
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
		});
	}
}
