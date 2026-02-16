import { IActivitiesRepository } from '@/domain/activities/interfaces';
import { ActivityNotFoundException } from '@/domain/activities/exceptions';
import { Question } from '@/domain/activities/entities/question.entity';

export class FindQuestionsUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(quizId: string): Promise<Question[]> {
		const quiz = await this.activitiesRepository.findOneQuiz(quizId);

		if (!quiz) {
			throw new ActivityNotFoundException(quizId);
		}

		const questions = quiz.findQuestions();

		return questions;
	}
}
