export class LearningPathNotFoundException extends Error {
	constructor(id: string) {
		const message = `Learning path with id ${id} not found`;

		super(message);
	}
}
