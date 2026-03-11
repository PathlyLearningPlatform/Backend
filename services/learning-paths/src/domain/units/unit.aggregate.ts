import { AggregateRoot, Order } from '../common';
import { SectionId } from '../sections/value-objects/id.vo';
import { UnitCannotBeRemovedException } from './exceptions';
import { LessonAlreadyExistsException } from './exceptions/lesson-already-exists.exception';
import { LessonId } from '../lessons/value-objects/id.vo';
import { LessonRef, UnitDescription, UnitId, UnitName } from './value-objects';

type UnitProps = {
	sectionId: SectionId;
	name: UnitName;
	description: UnitDescription | null;
	createdAt: Date;
	updatedAt: Date | null;
	order: Order;
	lessonRefs: LessonRef[];
	lessonCount: number;
};
type CreateUnitProps = {
	sectionId: SectionId;
	name: UnitName;
	description?: UnitDescription | null;
	createdAt: Date;
	order: Order;
};
type UpdateUnitProps = Partial<
	Pick<UnitProps, 'name' | 'description' | 'order'>
>;
type UnitFromDataSourceProps = {
	id: string;
	sectionId: string;
	name: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	order: number;
	lessonRefs: LessonRef[];
	lessonCount: number;
};

export class Unit extends AggregateRoot<UnitId, UnitProps> {
	private readonly _props: UnitProps;

	private constructor(id: UnitId, props: UnitProps) {
		super(id);
		this._props = props;
	}

	static fromDataSource(props: UnitFromDataSourceProps) {
		const id = UnitId.create(props.id);
		const sectionId = SectionId.create(props.sectionId);
		const name = UnitName.create(props.name);
		const description = props.description
			? UnitDescription.create(props.description)
			: null;
		const order = Order.create(props.order);

		const unit = new Unit(id, {
			sectionId,
			name,
			description,
			order,
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
			lessonRefs: props.lessonRefs,
			lessonCount: props.lessonCount,
		});

		unit._rearrangeLessons();

		return unit;
	}

	static create(id: UnitId, props: CreateUnitProps) {
		const unit = new Unit(id, {
			name: props.name,
			createdAt: props.createdAt,
			description: props.description ?? null,
			sectionId: props.sectionId,
			updatedAt: null,
			order: props.order,
			lessonRefs: [],
			lessonCount: 0,
		});

		return unit;
	}

	get id(): UnitId {
		return this._id;
	}

	get sectionId(): SectionId {
		return this._props.sectionId;
	}

	get name(): UnitName {
		return this._props.name;
	}

	get description(): UnitDescription | null {
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

	get lessonCount(): number {
		return this._props.lessonCount;
	}

	update(now: Date, props?: UpdateUnitProps) {
		if (props?.name) {
			this._props.name = props.name;
		}

		if (props?.description) {
			this._props.description = props.description;
		}

		if (props?.order !== undefined) {
			this._props.order = props.order;
		}

		this._props.updatedAt = now;
	}

	ensureCanRemove() {
		if (this._props.lessonRefs.length > 0) {
			throw new UnitCannotBeRemovedException(this._id.value);
		}
	}

	addLesson(lessonId: LessonId): LessonRef {
		if (this._findLesson(lessonId)) {
			throw new LessonAlreadyExistsException(lessonId.value);
		}

		const lessonRef = LessonRef.create({
			lessonId: lessonId.value,
			order: this._props.lessonRefs.length,
		});

		this._props.lessonRefs.push(lessonRef);
		this._props.lessonCount = this._props.lessonRefs.length;

		return lessonRef;
	}

	removeLesson(lessonId: LessonId): void {
		const i = this._props.lessonRefs.findIndex((ref) =>
			ref.lessonId.equals(lessonId),
		);

		if (i === -1) {
			return;
		}

		this._props.lessonRefs.splice(i, 1);
		this._rearrangeLessons();
		this._props.lessonCount = this._props.lessonRefs.length;
	}

	reorderLesson(lessonId: LessonId, newOrder: Order): Order | null {
		const currentIndex = this._props.lessonRefs.findIndex((ref) =>
			ref.lessonId.equals(lessonId),
		);

		if (currentIndex === -1) {
			return null;
		}

		const clampedOrder = Order.create(
			Math.max(0, Math.min(newOrder.value, this._props.lessonRefs.length - 1)),
		);

		const [ref] = this._props.lessonRefs.splice(currentIndex, 1);
		this._props.lessonRefs.splice(clampedOrder.value, 0, ref);
		this._rearrangeLessons();

		return clampedOrder;
	}

	private _findLesson(lessonId: LessonId): LessonRef | null {
		const ref = this._props.lessonRefs.find((ref) =>
			ref.lessonId.equals(lessonId),
		);

		return ref === undefined ? null : ref;
	}

	private _rearrangeLessons(): void {
		this._props.lessonRefs = this._props.lessonRefs.map(
			(ref, i) =>
				new LessonRef({
					order: Order.create(i),
					lessonId: ref.lessonId,
				}),
		);
	}
}
