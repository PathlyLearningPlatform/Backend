import { AggregateRoot, UserId, UUID } from '../common';
import { SectionId } from '../section-progress';
import { UnitCompletedEvent } from './events';
import { UnitId, UnitProgressId } from './value-objects';

export type UnitProgressProps = {
	unitId: UnitId;
	sectionId: SectionId;
	userId: UserId;
	completedAt: Date | null;
	completedLessonCount: number;
	totalLessonCount: number;
};

export type UnitProgressFromDataSourceProps = {
	id: string;
	unitId: string;
	sectionId: string;
	userId: string;
	completedAt: Date | null;
	completedLessonCount: number;
	totalLessonCount: number;
};

export type CreateUnitProgressProps = {
	unitId: UnitId;
	sectionId: SectionId;
	userId: UserId;
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
		const id = UnitProgressId.create(UUID.create(props.id));
		const unitId = UnitId.create(UUID.create(props.unitId));
		const userId = UserId.create(UUID.create(props.userId));
		const sectionId = SectionId.create(UUID.create(props.sectionId));

		return new UnitProgress(id, {
			unitId,
			userId,
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
			unitId: props.unitId,
			completedAt: null,
			sectionId: props.sectionId,
			userId: props.userId,
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
				this._props.unitId.toString(),
				this._props.sectionId.toString(),
				this._props.userId.toString(),
				now,
			),
		);
	}

	get id(): UnitProgressId {
		return this._id;
	}

	get unitId(): UnitId {
		return this._props.unitId;
	}

	get sectionId(): SectionId {
		return this._props.sectionId;
	}

	get userId(): UserId {
		return this._props.userId;
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
