import { type ICommandHandler, QuestionNotFoundException } from '@/app/common';
import { QuestionId } from '@/domain/quizzes/value-objects';
import { ActivityId } from '@/domain/activities/value-objects/id.vo';
import { IQuizRepository } from '@/domain/quizzes/repositories';
import { QuizNotFoundException } from '@/app/common/exceptions/quiz-not-found.exception';

type RemoveQuestionCommand = {
	quizId: string;
	questionId: string;
};

export class RemoveQuestionHandler
	implements ICommandHandler<RemoveQuestionCommand, void>
{
	constructor(private readonly quizRepository: IQuizRepository) {}

	async execute(command: RemoveQuestionCommand): Promise<void> {
		const quizId = ActivityId.create(command.quizId);
		const quiz = await this.quizRepository.findById(quizId);

		if (!quiz) {
			throw new QuizNotFoundException(quizId.value);
		}

		const questionId = QuestionId.create(command.questionId);

		if (!quiz.questions.find((q) => q.id.equals(questionId))) {
			throw new QuestionNotFoundException(questionId.value);
		}

		quiz.removeQuestion(questionId);
		quiz.update(new Date());

		await this.quizRepository.save(quiz);
	}
}
