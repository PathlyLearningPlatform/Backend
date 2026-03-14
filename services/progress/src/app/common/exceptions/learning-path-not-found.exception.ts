import { AppException } from './app.exception';

export class LearningPathNotFoundException extends AppException {
	constructor(public readonly learningPathId: string) {
		const message = `Learning path with id = ${learningPathId} was not found.`;
		super(message);
	}
}
