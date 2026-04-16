import { Order } from '@/domain/common';
import { LessonId } from '@/domain/lessons/value-objects';
import {
	Activity,
	type ActivityFromDataSourceProps,
	type ActivityProps,
	type CreateActivityProps,
	type UpdateActivityProps,
	ActivityDescription,
	ActivityId,
	ActivityName,
	ActivityType,
} from '../activities';
import { QuestionAlreadyExistsException } from './exceptions';
import type { Question } from './question.entity';
import type { QuestionId } from './value-objects';

type QuizProps = ActivityProps & {
	questions: Question[];
	questionCount: number;
};
type CreateQuizProps = Omit<CreateActivityProps & {}, 'type'>;
type QuizFromDataSource = Omit<
	ActivityFromDataSourceProps & {
		questions: Question[];
		questionCount: number;
	},
	'type'
>;
type UpdateQuizProps = UpdateActivityProps & Partial<{}>;

export class Quiz extends Activity {
	protected readonly _props: QuizProps;

	private constructor(id: ActivityId, props: QuizProps) {
		super(id, props);
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
		});
	}

	update(now: Date, props?: UpdateQuizProps) {
		super.update(now, props);
	}

	get questions(): readonly Question[] {
		return this._props.questions;
	}

	get questionCount(): number {
		return this._props.questionCount;
	}

	addQuestion(question: Question): void {
		if (this.findQuestion(question.id)) {
			throw new QuestionAlreadyExistsException(question.id.value);
		}

		this._props.questions.push(question);
		this._props.questionCount = this._props.questions.length;
	}

	removeQuestion(id: QuestionId) {
		const i = this._props.questions.findIndex((q) => q.id.equals(id));

		if (i === -1) {
			return;
		}

		this._props.questions.splice(i, 1);
		this._props.questionCount = this._props.questions.length;

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
