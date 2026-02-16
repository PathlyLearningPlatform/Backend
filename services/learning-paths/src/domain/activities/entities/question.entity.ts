export interface QuestionFields {
	id: string;
	order: number;
	quizId: string;
	content: string;
	correctAnswer: string;
}

export type QuestionRequiredCreateFields = Pick<
	QuestionFields,
	'quizId' | 'content' | 'correctAnswer'
>;
export type QuestionAllowedCreateFields = Omit<QuestionFields, 'id' | 'order'>;
export type QuestionCreateFields = QuestionRequiredCreateFields &
	QuestionAllowedCreateFields;
export type QuestionUpdateFields = Partial<
	Omit<QuestionFields, 'id' | 'quizId' | 'order'>
>;

export class Question implements QuestionFields {
	constructor(fields: QuestionFields) {
		this.id = fields.id;
		this.quizId = fields.quizId;
		this.order = fields.order;
		this.content = fields.content;
		this.correctAnswer = fields.correctAnswer;
	}

	update(fields?: QuestionUpdateFields) {
		if (fields?.content) {
			this.content = fields.content;
		}

		if (fields?.correctAnswer) {
			this.correctAnswer = fields.correctAnswer;
		}
	}

	id: string;
	order: number;
	quizId: string;
	content: string;
	correctAnswer: string;
}
