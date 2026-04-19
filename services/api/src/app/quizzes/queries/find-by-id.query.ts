import { type IQueryHandler } from '@/app/common';
import { ActivityId } from '@/domain/activities';
import type { QuizDto } from '../dtos';
import { aggregateToDto } from '../helpers';
import { IQuizRepository } from '@/domain/quizzes/repositories';
import { QuizNotFoundException } from '@/app/common/exceptions/quiz-not-found.exception';

type FindQuizByIdQuery = {
	where: {
		id: string;
	};
};
type FindQuizByIdResult = QuizDto;

export class FindQuizByIdHandler
	implements IQueryHandler<FindQuizByIdQuery, FindQuizByIdResult>
{
	constructor(private readonly quizRepository: IQuizRepository) {}

	async execute(query: FindQuizByIdQuery): Promise<FindQuizByIdResult> {
		const quizId = ActivityId.create(query.where.id);
		const quiz = await this.quizRepository.findById(quizId);

		if (!quiz) {
			throw new QuizNotFoundException(query.where.id);
		}

		return aggregateToDto(quiz);
	}
}
