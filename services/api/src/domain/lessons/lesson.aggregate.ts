import type { ActivityId } from "../activities/value-objects/id.vo";
import { AggregateRoot, Order } from "../common";
import { InvalidOrderException } from "../common/exceptions";
import { UnitId } from "../units/value-objects/id.vo";
import {
	ActivityAlreadyExistsException,
	LessonCannotBeRemovedException,
} from "./exceptions";
import {
	ActivityRef,
	LessonDescription,
	LessonId,
	LessonName,
} from "./value-objects";

type LessonProps = {
	unitId: UnitId;
	name: LessonName;
	description: LessonDescription | null;
	createdAt: Date;
	updatedAt: Date | null;
	order: Order;
	activityRefs: ActivityRef[];
	activityCount: number;
};
type CreateLessonProps = {
	unitId: UnitId;
	name: LessonName;
	description?: LessonDescription | null;
	createdAt: Date;
	order: Order;
};
type UpdateLessonProps = Partial<
	Pick<LessonProps, "name" | "description" | "order">
>;
type LessonFromDataSourceProps = {
	id: string;
	unitId: string;
	name: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	order: number;
	activityRefs: ActivityRef[];
	activityCount: number;
};

export class Lesson extends AggregateRoot<LessonId, LessonProps> {
	private readonly _props: LessonProps;

	private constructor(id: LessonId, props: LessonProps) {
		super(id);
		this._props = props;
	}

	static fromDataSource(props: LessonFromDataSourceProps) {
		const id = LessonId.create(props.id);
		const unitId = UnitId.create(props.unitId);
		const name = LessonName.create(props.name);
		const description = props.description
			? LessonDescription.create(props.description)
			: null;
		const order = Order.create(props.order);

		const lesson = new Lesson(id, {
			unitId,
			name,
			description,
			order,
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
			activityRefs: props.activityRefs,
			activityCount: props.activityCount,
		});

		lesson._rearrangeActivities();

		return lesson;
	}

	static create(id: LessonId, props: CreateLessonProps) {
		const lesson = new Lesson(id, {
			name: props.name,
			createdAt: props.createdAt,
			description: props.description ?? null,
			unitId: props.unitId,
			updatedAt: null,
			order: props.order,
			activityRefs: [],
			activityCount: 0,
		});

		return lesson;
	}

	get id(): LessonId {
		return this._id;
	}

	get unitId(): UnitId {
		return this._props.unitId;
	}

	get name(): LessonName {
		return this._props.name;
	}

	get description(): LessonDescription | null {
		return this._props.description;
	}

	get createdAt(): Date {
		return this._props.createdAt;
	}

	get updatedAt(): Date | null {
		return this._props.updatedAt;
	}

	get order(): Order {
		return this._props.order;
	}

	get activityCount(): number {
		return this._props.activityCount;
	}

	update(now: Date, props?: UpdateLessonProps) {
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

	ensureCanRemove() {
		if (this._props.activityRefs.length > 0) {
			throw new LessonCannotBeRemovedException(this._id.value);
		}
	}

	addActivity(activityId: ActivityId): ActivityRef {
		if (this._findActivity(activityId)) {
			throw new ActivityAlreadyExistsException(activityId.value);
		}

		const activityRef = ActivityRef.create({
			activityId: activityId.value,
			order: this._props.activityRefs.length,
		});

		this._props.activityRefs.push(activityRef);
		this._props.activityCount = this._props.activityRefs.length;

		return activityRef;
	}

	removeActivity(activityId: ActivityId): void {
		const i = this._props.activityRefs.findIndex((ref) =>
			ref.activityId.equals(activityId),
		);

		if (i === -1) {
			return;
		}

		this._props.activityRefs.splice(i, 1);
		this._rearrangeActivities();
		this._props.activityCount = this._props.activityRefs.length;
	}

	reorderActivity(activityId: ActivityId, newOrder: Order): Order | null {
		const currentIndex = this._props.activityRefs.findIndex((ref) =>
			ref.activityId.equals(activityId),
		);

		if (currentIndex === -1) {
			return null;
		}

		const clampedOrder = Order.create(
			Math.max(
				0,
				Math.min(newOrder.value, this._props.activityRefs.length - 1),
			),
		);

		const [ref] = this._props.activityRefs.splice(currentIndex, 1);
		this._props.activityRefs.splice(clampedOrder.value, 0, ref);
		this._rearrangeActivities();

		return clampedOrder;
	}

	private _findActivity(activityId: ActivityId): ActivityRef | null {
		const ref = this._props.activityRefs.find((ref) =>
			ref.activityId.equals(activityId),
		);

		return ref === undefined ? null : ref;
	}

	private _rearrangeActivities(): void {
		this._props.activityRefs = this._props.activityRefs.map(
			(ref, i) =>
				new ActivityRef({
					order: Order.create(i),
					activityId: ref.activityId,
				}),
		);
	}
}
