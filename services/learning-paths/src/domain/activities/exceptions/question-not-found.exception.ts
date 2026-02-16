export class QuestionNotFoundException extends Error {
	constructor(id: string) {
		const message = `question with id = ${id} not found`;

		super(message);

		this.message = message;
	}
}
