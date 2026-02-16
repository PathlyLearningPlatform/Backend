import { IActivitiesRepository } from '@/domain/activities/interfaces';
import { CreateQuestionCommand, UpdateQuestionCommand } from '../commands';
import {
	ActivityNotFoundException,
	QuestionNotFoundException,
} from '@/domain/activities/exceptions';
import { Question } from '@/domain/activities/entities/question.entity';

export class UpdateQuestionUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(command: UpdateQuestionCommand): Promise<Question> {
		const quiz = await this.activitiesRepository.findOneQuiz(
			command.where.quizId,
		);

		if (!quiz) {
			throw new ActivityNotFoundException(command.where.quizId);
		}

		const question = quiz.findOneQuestion(command.where.id);

		if (!question) {
			throw new QuestionNotFoundException(command.where.id);
		}

		question.update(command.fields);

		this.activitiesRepository.saveQuiz(quiz);

		return question;
	}
}
