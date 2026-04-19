import { AppException } from './app.exception';

export class QuizNotFoundException extends AppException {
	constructor(public readonly quizId: string) {
		const message = `Quiz with id = ${quizId} was not found.`;
		super(message);
	}
}
