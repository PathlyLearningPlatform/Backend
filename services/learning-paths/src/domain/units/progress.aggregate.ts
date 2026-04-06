import { AggregateRoot, UserId, UUID } from "../common";
import { SectionId } from "../sections/value-objects/id.vo";
import { UnitCompletedEvent } from "./events";
import { UnitId, UnitProgressId } from "./value-objects";

export type UnitProgressProps = {
	sectionId: SectionId;
	completedAt: Date | null;
	completedLessonCount: number;
	totalLessonCount: number;
};

export type UnitProgressFromDataSourceProps = {
	unitId: string;
	sectionId: string;
	userId: string;
	completedAt: Date | null;
	completedLessonCount: number;
	totalLessonCount: number;
};

export type CreateUnitProgressProps = {
	sectionId: SectionId;
	totalLessonCount: number;
};

export class UnitProgress extends AggregateRoot<
	UnitProgressId,
	UnitProgressProps
> {
	private readonly _props: UnitProgressProps;

	private constructor(id: UnitProgressId, props: UnitProgressProps) {
		super(id);
		this._props = props;
	}

	static fromDataSource(props: UnitProgressFromDataSourceProps): UnitProgress {
		const unitId = UnitId.create(props.unitId);
		const sectionId = SectionId.create(props.sectionId);
		const userId = UserId.create(UUID.create(props.userId));
		const id = UnitProgressId.create(unitId, userId);

		return new UnitProgress(id, {
			sectionId,
			completedAt: props.completedAt,
			completedLessonCount: props.completedLessonCount,
			totalLessonCount: props.totalLessonCount,
		});
	}

	static create(
		id: UnitProgressId,
		props: CreateUnitProgressProps,
	): UnitProgress {
		return new UnitProgress(id, {
			sectionId: props.sectionId,
			completedAt: null,
			completedLessonCount: 0,
			totalLessonCount: props.totalLessonCount,
		});
	}

	completeLesson(now: Date) {
		if (this._props.completedAt !== null) {
			return;
		}

		if (++this._props.completedLessonCount !== this._props.totalLessonCount) {
			return;
		}

		this._props.completedAt = now;

		this.addEvent(
			new UnitCompletedEvent(
				this._id.unitId.value,
				this._props.sectionId.value,
				this._id.userId.toString(),
				now,
			),
		);
	}

	get unitId(): UnitId {
		return this._id.unitId;
	}

	get sectionId(): SectionId {
		return this._props.sectionId;
	}

	get userId(): UserId {
		return this._id.userId;
	}

	get completedAt(): Date | null {
		return this._props.completedAt;
	}

	get totalLessonCount(): number {
		return this._props.totalLessonCount;
	}

	get completedLessonCount(): number {
		return this._props.completedLessonCount;
	}
}
