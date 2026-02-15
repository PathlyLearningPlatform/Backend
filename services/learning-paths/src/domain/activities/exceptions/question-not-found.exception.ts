export class QuestionNotFoundException extends Error {
	constructor(quizId: string, id: number) {
		const message = `question with id = ${id} in quiz with id = ${quizId} not found`;

		super(message);

		this.message = message;
	}
}
