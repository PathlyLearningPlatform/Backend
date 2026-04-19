import { QuizAttempt } from './attempt.aggregate';
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
		const questionUserAnswerMap = new Map<string, string>();

		for (const answer of attempt.answers) {
			questionUserAnswerMap.set(answer.questionId.value, answer.text);
		}

		for (const question of quiz.questions) {
			const userAnswer = questionUserAnswerMap.get(question.id.value);

			if (!userAnswer) {
				attempt.markAnswerAs(question.id, false);
				return;
			}

			const isCorrect = await verifyAnswerFunc(
				userAnswer,
				question.correctAnswer,
			);

			attempt.markAnswerAs(question.id, isCorrect);
		}
	}
}
