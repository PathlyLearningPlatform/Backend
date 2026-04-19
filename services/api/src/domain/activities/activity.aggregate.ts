import { AggregateRoot, Order } from '../common';
import { LessonId } from '../lessons/value-objects';
import {
	ActivityDescription,
	ActivityId,
	ActivityName,
	ActivityType,
} from './value-objects';

export type ActivityProps = {
	lessonId: LessonId;
	createdAt: Date;
	updatedAt: Date | null;
	name: ActivityName;
	description: ActivityDescription | null;
	order: Order;
	type: ActivityType;
};
export type CreateActivityProps = {
	lessonId: LessonId;
	createdAt: Date;
	name: ActivityName;
	description?: ActivityDescription | null;
	order: Order;
	type: ActivityType;
};
export type ActivityFromDataSourceProps = {
	id: string;
	lessonId: string;
	createdAt: Date;
	updatedAt: Date | null;
	name: string;
	description: string | null;
	order: number;
	type: ActivityType;
};
export type UpdateActivityProps = Partial<{
	name: ActivityName;
	description: ActivityDescription | null;
	order: Order;
}>;

export class Activity extends AggregateRoot<ActivityId, ActivityProps> {
	private readonly _props: ActivityProps;

	private constructor(id: ActivityId, props: ActivityProps) {
		super(id);
		this._props = props;
	}

	static create(id: ActivityId, props: CreateActivityProps): Activity {
		return new Activity(id, {
			createdAt: props.createdAt,
			description: props.description ?? null,
			lessonId: props.lessonId,
			name: props.name,
			order: props.order,
			type: props.type,
			updatedAt: null,
		});
	}

	static fromDataSource(props: ActivityFromDataSourceProps): Activity {
		return new Activity(ActivityId.create(props.id), {
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
			description: props.description
				? ActivityDescription.create(props.description)
				: null,
			lessonId: LessonId.create(props.lessonId),
			name: ActivityName.create(props.name),
			order: Order.create(props.order),
			type: props.type,
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

	update(now: Date, props?: UpdateActivityProps) {
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
}
