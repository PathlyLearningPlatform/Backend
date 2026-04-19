import { AppException } from './app.exception';

export class QuizAttemptNotFoundException extends AppException {
	constructor(public readonly quizAttemptId: string) {
		const message = `Quiz attempt with id = ${quizAttemptId} was not found.`;
		super(message);
	}
}
