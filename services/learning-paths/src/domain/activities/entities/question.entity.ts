export interface QuestionFields {
	id: number;
	quizId: string;
	content: string;
	correctAnswer: string;
}

export type QuestionRequiredCreateFields = Pick<
	QuestionFields,
	'quizId' | 'content' | 'correctAnswer'
>;
export type QuestionAllowedCreateFields = Omit<QuestionFields, 'id'>;
export type QuestionCreateFields = QuestionRequiredCreateFields &
	QuestionAllowedCreateFields;
export type QuestionUpdateFields = Partial<
	Omit<QuestionFields, 'id' | 'quizId'>
>;

export class Question implements QuestionFields {
	constructor(fields: QuestionFields) {
		this.id = fields.id;
		this.quizId = fields.quizId;
		this.content = fields.content;
		this.correctAnswer = fields.correctAnswer;
	}

	id: number;
	quizId: string;
	content: string;
	correctAnswer: string;

	update(fields?: QuestionUpdateFields) {
		if (fields?.content) {
			this.content = fields.content;
		}

		if (fields?.correctAnswer) {
			this.correctAnswer = fields.correctAnswer;
		}
	}
}
