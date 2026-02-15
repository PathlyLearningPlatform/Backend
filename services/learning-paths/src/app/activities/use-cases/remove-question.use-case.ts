import { IActivitiesRepository } from '@/domain/activities/interfaces';
import {
	ActivityNotFoundException,
	QuestionNotFoundException,
} from '@/domain/activities/exceptions';

export class RemoveQuestionUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(quizId: string, id: number): Promise<void> {
		const quiz = await this.activitiesRepository.findOneQuiz(quizId);

		if (!quiz) {
			throw new ActivityNotFoundException(quizId);
		}

		const wasRemoved = quiz.removeQuestion(id);

		if (!wasRemoved) {
			throw new QuestionNotFoundException(quizId, id);
		}

		await this.activitiesRepository.saveQuiz(quiz);
	}
}
