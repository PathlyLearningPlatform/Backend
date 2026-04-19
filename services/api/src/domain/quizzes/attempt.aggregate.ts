import { ActivityId } from '../activities';
import { AggregateRoot, UserId, UUID } from '../common';
import { UserAnswer, QuestionId } from './value-objects';
import { QuizAttemptId } from './value-objects/attempt-id.vo';

export type QuizAttemptProps = {
	quizId: ActivityId;
	userId: UserId;
	answers: UserAnswer[];
	attemptedAt: Date;
	score: number;
};

export type CreateQuizAttemptProps = {
	quizId: ActivityId;
	userId: UserId;
	answers: UserAnswer[];
	attemptedAt: Date;
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
			score: props.score,
			answers: props.answers.map((item) =>
				UserAnswer.create({
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

	markAnswerAs(questionId: QuestionId, isCorrect: boolean) {
		this._props.answers = this._props.answers.map((item) => {
			if (item.questionId.equals(questionId)) {
				if (!item.isCorrect && isCorrect) {
					this._props.score++;
				}

				if (item.isCorrect && !isCorrect) {
					this._props.score--;
				}

				return UserAnswer.create({
					isCorrect: isCorrect,
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

	get attemptedAt(): Date {
		return this._props.attemptedAt;
	}

	get id(): QuizAttemptId {
		return this._id;
	}

	get answers(): UserAnswer[] {
		return this._props.answers;
	}
}
