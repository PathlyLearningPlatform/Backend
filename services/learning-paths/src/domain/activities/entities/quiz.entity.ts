export interface IQuiz {
	activityId: string;
}

export type QuizRequiredCreateFields = Pick<IQuiz, 'activityId'>;
// export type QuizAllowedCreateFields = {};
export type QuizCreateFields =
	QuizRequiredCreateFields /* & QuizAllowedCreateFields */;

export type QuizUpdateFields = Partial<Omit<IQuiz, 'activityId'>>;

export class Quiz implements IQuiz {
	constructor(fields: IQuiz) {
		this.activityId = fields.activityId;
	}

	update(fields: QuizUpdateFields) {}

	activityId: string;
}
