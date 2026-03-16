import { AppException } from '@/app/common';

export class LearningPathProgressNotFoundException extends AppException {
	constructor(public readonly id: string) {
		const message = `Learning path progress with id = ${id} was not found`;

		super(message);
	}
}
