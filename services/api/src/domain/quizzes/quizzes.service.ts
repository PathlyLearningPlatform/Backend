import { QuizAttempt } from './attempt.aggregate';
import { AnswerNotProvidedException } from './exceptions/answer-not-provided.exception';
import { Quiz } from './quiz.aggregate';

export type VerifyAnswerFunc = (
	userAnswer: string,
	correctAnswer: string,
) => Promise<boolean>;

export class QuizService {
	async complete(
		quiz: Quiz,
		attempt: QuizAttempt,
		verifyAnswerFunc: VerifyAnswerFunc,
	) {
		const questionAnswerMap = new Map<string, string>();

		for (const answer of attempt.answers) {
			questionAnswerMap.set(answer.questionId.value, answer.text);
		}

		if (attempt.answers.length !== quiz.questions.length) {
			throw new AnswerNotProvidedException();
		}

		for (const question of quiz.questions) {
			const userAnswer = questionAnswerMap.get(question.id.value);

			if (!userAnswer) {
				throw new AnswerNotProvidedException();
			}

			const isCorrect = await verifyAnswerFunc(
				userAnswer,
				question.correctAnswer,
			);

			if (isCorrect) {
				attempt.markAnswerAsCorrect(question.id);
			}
		}
	}
}
