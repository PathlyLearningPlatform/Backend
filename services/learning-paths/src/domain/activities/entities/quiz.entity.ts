import { randomUUID } from 'node:crypto';
import {
	Activity,
	ActivityAllowedCreateFields,
	ActivityFields,
	ActivityRequiredCreateFields,
	ActivityUpdateFields,
} from './activity.entity';
import {
	Question,
	QuestionCreateFields,
	QuestionUpdateFields,
} from './question.entity';

export interface QuizFields extends ActivityFields {
	questions: Question[];
	nextQuestionOrder: number;
}

export type QuizRequiredCreateFields = ActivityRequiredCreateFields;
export type QuizAllowedCreateFields = ActivityAllowedCreateFields;
export type QuizCreateFields = QuizRequiredCreateFields &
	QuizAllowedCreateFields;
export type QuizUpdateFields = ActivityUpdateFields;

export class Quiz extends Activity {
	constructor(fields: QuizFields) {
		super(fields);

		this.nextQuestionOrder = fields.nextQuestionOrder;
		this.questions = fields.questions;
	}

	update(fields?: QuizUpdateFields) {
		if (fields?.name !== undefined) {
			this.name = fields.name;
		}

		if (fields?.description !== undefined) {
			this.description = fields.description;
		}

		if (fields?.lessonId !== undefined) {
			this.lessonId = fields.lessonId;
		}

		if (fields?.order !== undefined) {
			this.order = fields.order;
		}
	}

	findQuestions() {
		return this.questions.sort((q1, q2) => q1.order - q2.order);
	}
	findOneQuestion(id: string): Question | null {
		const question = this.questions.find((q) => q.id === id);

		return question ?? null;
	}
	createQuestion(fields: QuestionCreateFields): Question {
		const question = new Question({
			content: fields.content,
			correctAnswer: fields.correctAnswer,
			quizId: this.id,
			id: randomUUID(),
			order: this.nextQuestionOrder,
		});

		this.nextQuestionOrder++;

		this.questions.push(question);

		return question;
	}
	updateQuestion(id: string, fields: QuestionUpdateFields): Question | null {
		const question = this.questions.find((q) => q.id === id);

		if (!question) {
			return null;
		}

		question.update(fields);

		return question;
	}
	removeQuestion(id: string): boolean {
		const filteredQuestions = this.questions.filter((q) => q.id !== id);

		if (filteredQuestions.length === this.questions.length) {
			return false;
		}

		this.questions = filteredQuestions;

		return true;
	}

	nextQuestionOrder: number;
	questions: Question[];
}
