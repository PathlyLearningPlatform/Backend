import { IActivitiesRepository } from '@/domain/activities/interfaces';
import { CreateQuestionCommand } from '../commands';
import { ActivityNotFoundException } from '@/domain/activities/exceptions';
import { Question } from '@/domain/activities/entities/question.entity';

export class CreateQuestionUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(command: CreateQuestionCommand): Promise<Question> {
		const quiz = await this.activitiesRepository.findOneQuiz(command.quizId);

		if (!quiz) {
			throw new ActivityNotFoundException(command.quizId);
		}

		const question = quiz.createQuestion({
			content: command.content,
			correctAnswer: command.correctAnswer,
			quizId: quiz.id,
		});

		this.activitiesRepository.saveQuiz(quiz);

		return question;
	}
}
