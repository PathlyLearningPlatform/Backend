import { AggregateRoot, Order } from '@/domain/common';
import { LessonId } from '@/domain/lessons/value-objects';
import {
	ActivityDescription,
	ActivityId,
	ActivityName,
	ActivityType,
} from '../activities';
import { QuestionAlreadyExistsException } from './exceptions';
import type { Question } from './question.entity';
import type { QuestionId } from './value-objects';

type QuizProps = {
	questions: Question[];
	questionCount: number;
	maxScore: number;
	lessonId: LessonId;
	createdAt: Date;
	updatedAt: Date | null;
	name: ActivityName;
	description: ActivityDescription | null;
	order: Order;
	type: ActivityType;
};
type CreateQuizProps = {
	lessonId: LessonId;
	createdAt: Date;
	name: ActivityName;
	description?: ActivityDescription | null;
	order: Order;
};
type QuizFromDataSource = {
	id: string;
	lessonId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
	questions: Question[];
	questionCount: number;
	maxScore: number;
};
type UpdateQuizProps = Partial<{
	name: ActivityName;
	description: ActivityDescription | null;
	order: Order;
}>;

export class Quiz extends AggregateRoot<ActivityId, QuizProps> {
	protected readonly _props: QuizProps;

	private constructor(id: ActivityId, props: QuizProps) {
		super(id);
		this._props = props;
	}

	static create(id: ActivityId, props: CreateQuizProps) {
		return new Quiz(id, {
			createdAt: props.createdAt,
			description: props.description ?? null,
			lessonId: props.lessonId,
			name: props.name,
			order: props.order,
			type: ActivityType.QUIZ,
			updatedAt: null,
			questionCount: 0,
			questions: [],
			maxScore: 0,
		});
	}

	static fromDataSource(props: QuizFromDataSource) {
		return new Quiz(ActivityId.create(props.id), {
			createdAt: props.createdAt,
			description:
				props.description !== null
					? ActivityDescription.create(props.description)
					: null,
			lessonId: LessonId.create(props.lessonId),
			name: ActivityName.create(props.name),
			order: Order.create(props.order),
			type: ActivityType.QUIZ,
			updatedAt: props.updatedAt,
			questionCount: props.questionCount,
			questions: props.questions,
			maxScore: props.maxScore,
		});
	}

	update(now: Date, props?: UpdateQuizProps) {
		if (props?.name) {
			this._props.name = props.name;
		}

		if (props?.description) {
			this._props.description = props.description;
		}

		if (props?.order) {
			this._props.order = props.order;
		}

		this._props.updatedAt = now;
	}

	get id(): ActivityId {
		return this._id;
	}
	get lessonId(): LessonId {
		return this._props.lessonId;
	}
	get createdAt(): Date {
		return this._props.createdAt;
	}
	get updatedAt(): Date | null {
		return this._props.updatedAt;
	}
	get name(): ActivityName {
		return this._props.name;
	}
	get description(): ActivityDescription | null {
		return this._props.description;
	}
	get order(): Order {
		return this._props.order;
	}
	get type(): ActivityType {
		return this._props.type;
	}

	get questions(): readonly Question[] {
		return this._props.questions;
	}

	get questionCount(): number {
		return this._props.questionCount;
	}

	get maxScore(): number {
		return this._props.maxScore;
	}

	addQuestion(question: Question): void {
		if (this.findQuestion(question.id)) {
			throw new QuestionAlreadyExistsException(question.id.value);
		}

		this._props.questions.push(question);
		this._props.questionCount = this._props.questions.length;
		this._props.maxScore = this._props.questionCount;
	}

	removeQuestion(id: QuestionId) {
		const i = this._props.questions.findIndex((q) => q.id.equals(id));

		if (i === -1) {
			return;
		}

		this._props.questions.splice(i, 1);
		this._props.questionCount = this._props.questions.length;
		this._props.maxScore = this._props.questionCount;

		this._rearrangeQuestions();
	}

	reorderQuestion(questionId: QuestionId, newOrder: Order): Order | null {
		const currentIndex = this._props.questions.findIndex((q) =>
			q.id.equals(questionId),
		);

		if (currentIndex === -1) {
			return null;
		}

		const clampedOrder = Order.create(
			Math.max(0, Math.min(newOrder.value, this._props.questions.length - 1)),
		);

		const [ref] = this._props.questions.splice(currentIndex, 1);
		this._props.questions.splice(clampedOrder.value, 0, ref);
		this._rearrangeQuestions();

		return clampedOrder;
	}

	findQuestion(id: QuestionId): Question | null {
		const question = this._props.questions.find((q) => q.id.equals(id));

		return question ?? null;
	}

	private _rearrangeQuestions() {
		this._props.questions = this._props.questions.map((question, i) => {
			question.update(new Date(), { order: Order.create(i) });
			return question;
		});
	}
}
