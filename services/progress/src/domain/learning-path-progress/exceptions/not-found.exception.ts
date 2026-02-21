import { LearningPathProgressException } from './base.exception';

export class LearningPathProgressNotFoundException extends LearningPathProgressException {
	constructor(id: string) {
		const message = `Learning path progress with id = ${id} not found`;

		super(message);
	}
}
