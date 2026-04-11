import { AggregateRoot, Order, UUID } from "../common";
import { LearningPathId } from "../learning-paths/value-objects";
import type { UnitId } from "../units/value-objects/id.vo";
import { SectionCannotBeRemovedException } from "./exceptions";
import { UnitAlreadyExistsException } from "./exceptions/unit-already-exists.exception";
import { SectionDescription, SectionName, UnitRef } from "./value-objects";
import { SectionId } from "./value-objects/id.vo";

type SectionProps = {
	learningPathId: LearningPathId;
	name: SectionName;
	description: SectionDescription | null;
	createdAt: Date;
	updatedAt: Date | null;
	order: Order;
	unitRefs: UnitRef[];
	unitCount: number;
};
type CreateSectionProps = {
	learningPathId: LearningPathId;
	name: SectionName;
	description?: SectionDescription | null;
	createdAt: Date;
	order: Order;
};
type UpdateSectionProps = Partial<
	Pick<SectionProps, "name" | "description" | "order">
>;
type SectionFromDataSourceProps = {
	id: string;
	learningPathId: string;
	name: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	order: number;
	unitRefs: UnitRef[];
	unitCount: number;
};

export class Section extends AggregateRoot<SectionId, SectionProps> {
	private readonly _props: SectionProps;

	private constructor(id: SectionId, props: SectionProps) {
		super(id);
		this._props = props;
	}

	static fromDataSource(props: SectionFromDataSourceProps) {
		const id = SectionId.create(props.id);
		const learningPathId = LearningPathId.create(
			UUID.create(props.learningPathId),
		);
		const name = SectionName.create(props.name);
		const description = props.description
			? SectionDescription.create(props.description)
			: null;
		const order = Order.create(props.order);

		const section = new Section(id, {
			learningPathId,
			name,
			description,
			order,
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
			unitRefs: props.unitRefs,
			unitCount: props.unitCount,
		});

		section._rearrangeUnits();

		return section;
	}

	static create(id: SectionId, props: CreateSectionProps) {
		const section = new Section(id, {
			name: props.name,
			createdAt: props.createdAt,
			description: props.description ?? null,
			learningPathId: props.learningPathId,
			updatedAt: null,
			order: props.order,
			unitRefs: [],
			unitCount: 0,
		});

		return section;
	}

	get id(): SectionId {
		return this._id;
	}

	get learningPathId(): LearningPathId {
		return this._props.learningPathId;
	}

	get name(): SectionName {
		return this._props.name;
	}

	get description(): SectionDescription | null {
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

	get unitCount(): number {
		return this._props.unitCount;
	}

	update(now: Date, props?: UpdateSectionProps) {
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
		if (this._props.unitRefs.length > 0) {
			throw new SectionCannotBeRemovedException(this._id.value);
		}
	}

	addUnit(unitId: UnitId): UnitRef {
		if (this._findUnit(unitId)) {
			throw new UnitAlreadyExistsException(unitId.value);
		}

		const unitRef = UnitRef.create({
			unitId: unitId.value,
			order: this._props.unitRefs.length,
		});

		this._props.unitRefs.push(unitRef);
		this._props.unitCount = this._props.unitRefs.length;

		return unitRef;
	}

	reorderUnit(unitId: UnitId, newOrder: Order): Order | null {
		const currentIndex = this._props.unitRefs.findIndex((ref) =>
			ref.unitId.equals(unitId),
		);

		if (currentIndex === -1) {
			return null;
		}

		const clampedOrder = Order.create(
			Math.max(0, Math.min(newOrder.value, this._props.unitRefs.length - 1)),
		);

		const [ref] = this._props.unitRefs.splice(currentIndex, 1);
		this._props.unitRefs.splice(clampedOrder.value, 0, ref);
		this._rearrangeUnits();

		return clampedOrder;
	}

	removeUnit(unitId: UnitId): void {
		const i = this._props.unitRefs.findIndex((ref) =>
			ref.unitId.equals(unitId),
		);

		if (i === -1) {
			return;
		}

		this._props.unitRefs.splice(i, 1);
		this._rearrangeUnits();
		this._props.unitCount = this._props.unitRefs.length;
	}

	private _findUnit(unitId: UnitId): UnitRef | null {
		const ref = this._props.unitRefs.find((ref) => ref.unitId.equals(unitId));

		return ref === undefined ? null : ref;
	}

	private _rearrangeUnits(): void {
		this._props.unitRefs = this._props.unitRefs.map(
			(ref, i) =>
				new UnitRef({
					order: Order.create(i),
					unitId: ref.unitId,
				}),
		);
	}
}
