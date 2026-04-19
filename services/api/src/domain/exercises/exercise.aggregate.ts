import { AggregateRoot, Order } from '@/domain/common';
import { LessonId } from '@/domain/lessons/value-objects';
import {
	ActivityDescription,
	ActivityId,
	ActivityName,
	ActivityType,
} from '../activities';
import type { ExerciseDifficulty } from './value-objects';

type ExerciseProps = {
	lessonId: LessonId;
	createdAt: Date;
	updatedAt: Date | null;
	name: ActivityName;
	description: ActivityDescription | null;
	order: Order;
	type: ActivityType;
	difficulty: ExerciseDifficulty;
};
type CreateExerciseProps = {
	difficulty: ExerciseDifficulty;
	lessonId: LessonId;
	createdAt: Date;
	name: ActivityName;
	description?: ActivityDescription | null;
	order: Order;
};

type ExerciseFromDataSourceProps = {
	id: string;
	lessonId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
	difficulty: ExerciseDifficulty;
};
type UpdateExerciseProps = Partial<{
	difficulty: ExerciseDifficulty;
	name: ActivityName;
	description: ActivityDescription | null;
	order: Order;
}>;

export class Exercise extends AggregateRoot<ActivityId, ExerciseProps> {
	protected readonly _props: ExerciseProps;

	private constructor(id: ActivityId, props: ExerciseProps) {
		super(id);
		this._props = props;
	}

	static create(id: ActivityId, props: CreateExerciseProps): Exercise {
		return new Exercise(id, {
			lessonId: props.lessonId,
			name: props.name,
			description: props.description ?? null,
			createdAt: props.createdAt,
			updatedAt: null,
			order: props.order,
			type: ActivityType.EXERCISE,
			difficulty: props.difficulty,
		});
	}

	static fromDataSource(props: ExerciseFromDataSourceProps): Exercise {
		return new Exercise(ActivityId.create(props.id), {
			lessonId: LessonId.create(props.lessonId),
			name: ActivityName.create(props.name),
			description: props.description
				? ActivityDescription.create(props.description)
				: null,
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
			order: Order.create(props.order),
			type: ActivityType.EXERCISE,
			difficulty: props.difficulty,
		});
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

	get difficulty(): ExerciseDifficulty {
		return this._props.difficulty;
	}

	update(now: Date, props?: UpdateExerciseProps): void {
		if (props?.name) {
			this._props.name = props.name;
		}

		if (props?.description) {
			this._props.description = props.description;
		}

		if (props?.order) {
			this._props.order = props.order;
		}

		if (props?.difficulty) {
			this._props.difficulty = props.difficulty;
		}

		this._props.updatedAt = now;
	}
}
