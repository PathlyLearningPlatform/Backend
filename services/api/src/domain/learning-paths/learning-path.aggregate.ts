import { Order } from "../common";
import { AggregateRoot } from "../common/aggregate-root";
import type { SectionId } from "../sections/value-objects/id.vo";
import { LearningPathCannotBeRemovedException } from "./exceptions";
import { SectionAlreadyExistsException } from "./exceptions/section-already-exists.exception";
import {
	LearningPathDescription,
	type LearningPathId,
	LearningPathName,
	SectionRef,
} from "./value-objects";

type LearningPathProps = {
	name: LearningPathName;
	description: LearningPathDescription | null;
	createdAt: Date;
	updatedAt: Date | null;
	sectionRefs: SectionRef[];
	sectionCount: number;
};
type CreateLearningPathProps = {
	name: string;
	description?: string | null;
	createdAt: Date;
};
type UpdateLearningPathProps = Partial<
	Pick<LearningPathProps, "name" | "description">
>;

export class LearningPath extends AggregateRoot<
	LearningPathId,
	LearningPathProps
> {
	private readonly _props: LearningPathProps;

	private constructor(id: LearningPathId, props: LearningPathProps) {
		super(id);
		this._props = props;
	}

	static fromDataSource(id: LearningPathId, props: LearningPathProps) {
		const learningPath = new LearningPath(id, props);

		learningPath._props.sectionRefs.sort(
			(a, b) => a.order.value - b.order.value,
		);
		learningPath._rearangeSections();

		return learningPath;
	}

	static create(id: LearningPathId, props: CreateLearningPathProps) {
		const name = new LearningPathName({ value: props.name });
		const description = props.description
			? new LearningPathDescription({ value: props.description })
			: null;

		const learningPath = new LearningPath(id, {
			createdAt: props.createdAt,
			description,
			name,
			sectionRefs: [],
			updatedAt: null,
			sectionCount: 0,
		});

		return learningPath;
	}

	get id(): LearningPathId {
		return this._id;
	}

	get name(): LearningPathName {
		return this._props.name;
	}

	get description(): LearningPathDescription | null {
		return this._props.description;
	}

	get sectionCount(): number {
		return this._props.sectionCount;
	}

	get createdAt(): Date {
		return this._props.createdAt;
	}

	get updatedAt(): Date | null {
		return this._props.updatedAt;
	}

	update(now: Date, props?: UpdateLearningPathProps) {
		if (props?.name) {
			this._props.name = props.name;
		}

		if (props?.description) {
			this._props.description = props.description;
		}

		this._props.updatedAt = now;
	}

	ensureCanRemove() {
		if (this._props.sectionRefs.length > 0) {
			throw new LearningPathCannotBeRemovedException(this._id.toString());
		}
	}

	addSection(sectionId: SectionId): SectionRef {
		const sectionRef = SectionRef.create({
			sectionId: sectionId,
			order: Order.create(this._props.sectionRefs.length),
		});

		if (this._findSection(sectionId)) {
			throw new SectionAlreadyExistsException(sectionId.value);
		}

		this._props.sectionRefs.push(sectionRef);
		this._props.sectionCount = this._props.sectionRefs.length;

		return sectionRef;
	}

	reorderSection(sectionId: SectionId, newOrder: Order): Order | null {
		const currentIndex = this._props.sectionRefs.findIndex((ref) =>
			ref.sectionId.equals(sectionId),
		);

		if (currentIndex === -1) {
			return null;
		}

		const clampedOrder = Order.create(
			Math.max(0, Math.min(this._props.sectionRefs.length - 1, newOrder.value)),
		);

		const [ref] = this._props.sectionRefs.splice(currentIndex, 1);
		this._props.sectionRefs.splice(clampedOrder.value, 0, ref);
		this._rearangeSections();

		return clampedOrder;
	}

	removeSection(sectionId: SectionId): void {
		const i = this._props.sectionRefs.findIndex((ref) =>
			ref.sectionId.equals(sectionId),
		);

		if (i === -1) {
			return;
		}

		this._props.sectionRefs.splice(i, 1);
		this._rearangeSections();
		this._props.sectionCount = this._props.sectionRefs.length;
	}

	private _findSection(sectionId: SectionId): SectionRef | null {
		const ref = this._props.sectionRefs.find((ref) =>
			ref.sectionId.equals(sectionId),
		);

		return ref === undefined ? null : ref;
	}

	private _rearangeSections(): void {
		this._props.sectionRefs = this._props.sectionRefs.map(
			(ref, i) =>
				new SectionRef({
					order: Order.create(i),
					sectionId: ref.sectionId,
				}),
		);
	}
}
