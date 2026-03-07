import { IQueryHandler, ActivityNotFoundException } from '@/app/common';
import { IActivityReadRepository } from '../interfaces';
import { QuizDto } from '../dtos';

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
