import { ActivityId } from '../activities';
import { AggregateRoot, UserId, UUID } from '../common';
import { Answer, QuestionId } from './value-objects';
import { QuizAttemptId } from './value-objects/attempt-id.vo';

export type QuizAttemptProps = {
	quizId: ActivityId;
	userId: UserId;
	answers: Answer[];
	attemptedAt: Date;
	score: number;
	maxScore: number;
};

export type CreateQuizAttemptProps = {
	quizId: ActivityId;
	userId: UserId;
	answers: Answer[];
	attemptedAt: Date;
	maxScore: number;
};

export type UpdateQuizAttemptProps = Partial<{
	score: number;
}>;

export type QuizAttemptFromDataSourceProps = {
	id: string;
	quizId: string;
	userId: string;
	answers: {
		questionId: string;
		text: string;
		isCorrect: boolean;
	}[];
	attemptedAt: Date;
	score: number;
	maxScore: number;
};

export class QuizAttempt extends AggregateRoot<
	QuizAttemptId,
	QuizAttemptProps
> {
	private readonly _props: QuizAttemptProps;

	private constructor(id: QuizAttemptId, props: QuizAttemptProps) {
		super(id);
		this._props = props;
	}

	static create(id: QuizAttemptId, props: CreateQuizAttemptProps): QuizAttempt {
		return new QuizAttempt(id, {
			answers: props.answers,
			attemptedAt: props.attemptedAt,
			maxScore: props.maxScore,
			score: 0,
			quizId: props.quizId,
			userId: props.userId,
		});
	}

	static fromDataSource(props: QuizAttemptFromDataSourceProps): QuizAttempt {
		const id = QuizAttemptId.create(UUID.create(props.id));
		const quizId = ActivityId.create(props.quizId);
		const userId = UserId.create(UUID.create(props.userId));

		return new QuizAttempt(id, {
			quizId,
			userId,
			maxScore: props.maxScore,
			score: props.score,
			answers: props.answers.map((item) =>
				Answer.create({
					questionId: QuestionId.create(item.questionId),
					text: item.text,
					isCorrect: item.isCorrect,
				}),
			),
			attemptedAt: props.attemptedAt,
		});
	}

	update(props: UpdateQuizAttemptProps) {
		if (props.score) {
			this._props.score = props.score;
		}
	}

	markAnswerAsCorrect(questionId: QuestionId) {
		this._props.answers = this._props.answers.map((item) => {
			if (item.questionId.equals(questionId) && !item.isCorrect) {
				this._props.score++;
				return Answer.create({
					isCorrect: true,
					questionId: item.questionId,
					text: item.text,
				});
			}

			return item;
		});
	}

	get quizId(): ActivityId {
		return this._props.quizId;
	}

	get userId(): UserId {
		return this._props.userId;
	}

	get score(): number {
		return this._props.score;
	}

	get maxScore(): number {
		return this._props.maxScore;
	}

	get attemptedAt(): Date {
		return this._props.attemptedAt;
	}

	get id(): QuizAttemptId {
		return this._id;
	}

	get answers(): Answer[] {
		return this._props.answers;
	}
}
