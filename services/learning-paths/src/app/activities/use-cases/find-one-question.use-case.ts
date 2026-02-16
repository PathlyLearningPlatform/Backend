import { IActivitiesRepository } from '@/domain/activities/interfaces';
import {
	ActivityNotFoundException,
	QuestionNotFoundException,
} from '@/domain/activities/exceptions';
import { Question } from '@/domain/activities/entities/question.entity';

export class FindOneQuestionUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(quizId: string, id: string): Promise<Question> {
		const quiz = await this.activitiesRepository.findOneQuiz(quizId);

		if (!quiz) {
			throw new ActivityNotFoundException(quizId);
		}

		const question = quiz.findOneQuestion(id);

		console.log(question);

		if (!question) {
			throw new QuestionNotFoundException(id);
		}

		return question;
	}
}
