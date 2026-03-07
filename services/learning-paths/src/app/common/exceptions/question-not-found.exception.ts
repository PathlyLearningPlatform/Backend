import { AppException } from './app.exception';

export class QuestionNotFoundException extends AppException {
	constructor(public readonly questionId: string) {
		const message = `Question with id = ${questionId} was not found.`;
		super(message);
	}
}
