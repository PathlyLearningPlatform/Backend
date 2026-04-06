import type { IQueryHandler, OffsetPagination } from "@/app/common";
import type { QuizWithoutQuestionsDto } from "../dtos";
import type { IActivityReadRepository } from "../interfaces";

type ListQuizzesQuery = {
	where?: {
		lessonId?: string;
	};
	options?: OffsetPagination;
};
type ListQuizzesResult = QuizWithoutQuestionsDto[];

export class ListQuizzesHandler
	implements IQueryHandler<ListQuizzesQuery, ListQuizzesResult>
{
	constructor(
		private readonly activityReadRepository: IActivityReadRepository,
	) {}

	async execute(query: ListQuizzesQuery): Promise<ListQuizzesResult> {
		return this.activityReadRepository.listQuizzes({
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
