import { Entity, Order } from "@/domain/common";
import { ActivityId } from "../value-objects";
import { QuestionId } from "./value-objects";

type QuestionProps = {
	quizId: ActivityId;
	content: string;
	order: Order;
	correctAnswer: string;
	createdAt: Date;
	updatedAt: Date | null;
};
type CreateQuestionProps = {
	quizId: ActivityId;
	content: string;
	order: Order;
	correctAnswer: string;
	createdAt: Date;
};
type QuestionFromDataSource = {
	id: string;
	quizId: string;
	content: string;
	order: number;
	correctAnswer: string;
	createdAt: Date;
	updatedAt: Date | null;
};
type UpdateQuestionProps = Partial<
	Pick<QuestionProps, "content" | "correctAnswer" | "order" | "createdAt">
>;

export class Question extends Entity<QuestionId, QuestionProps> {
	private readonly _props: QuestionProps;

	private constructor(id: QuestionId, props: QuestionProps) {
		super(id);
		this._props = props;
	}

	static create(id: QuestionId, props: CreateQuestionProps): Question {
		return new Question(id, { ...props, updatedAt: null });
	}

	static fromDataSource(props: QuestionFromDataSource): Question {
		return new Question(QuestionId.create(props.id), {
			content: props.content,
			correctAnswer: props.correctAnswer,
			order: Order.create(props.order),
			quizId: ActivityId.create(props.quizId),
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
		});
	}

	get quizId(): ActivityId {
		return this._props.quizId;
	}

	get content(): string {
		return this._props.content;
	}

	get correctAnswer(): string {
		return this._props.correctAnswer;
	}

	get order(): Order {
		return this._props.order;
	}

	get createdAt(): Date {
		return this._props.createdAt;
	}

	get updatedAt(): Date | null {
		return this._props.updatedAt ?? null;
	}

	update(now: Date, props?: UpdateQuestionProps) {
		if (props?.content) {
			this._props.content = props.content;
		}

		if (props?.correctAnswer) {
			this._props.correctAnswer = props.correctAnswer;
		}

		if (props?.order) {
			this._props.order = props.order;
		}

		this._props.updatedAt = now;
	}
}
