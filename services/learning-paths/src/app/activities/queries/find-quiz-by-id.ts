import { ActivityNotFoundException, type IQueryHandler } from "@/app/common";
import type { QuizDto } from "../dtos";
import type { IActivityReadRepository } from "../interfaces";

type FindQuizByIdQuery = {
	where: {
		id: string;
	};
};
type FindQuizByIdResult = QuizDto;

export class FindQuizByIdHandler
	implements IQueryHandler<FindQuizByIdQuery, FindQuizByIdResult>
{
	constructor(
		private readonly activityReadRepository: IActivityReadRepository,
	) {}

	async execute(query: FindQuizByIdQuery): Promise<FindQuizByIdResult> {
		const quiz = await this.activityReadRepository.findQuizById(query.where.id);

		if (!quiz) {
			throw new ActivityNotFoundException(query.where.id);
		}

		return quiz;
	}
}
