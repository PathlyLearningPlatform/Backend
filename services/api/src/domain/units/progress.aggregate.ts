import { AggregateRoot, UserId, UUID } from '../common';
import { SectionId } from '../sections/value-objects/id.vo';
import { UnitCompletedEvent, UnitStartedEvent } from './events';
import { UnitId, UnitProgressId } from './value-objects';

export type UnitProgressProps = {
	sectionId: SectionId;
	completedAt: Date | null;
	completedLessonCount: number;
	totalLessonCount: number;
	createdAt: Date;
	updatedAt: Date | null;
};

export type UnitProgressFromDataSourceProps = {
	unitId: string;
	sectionId: string;
	userId: string;
	completedAt: Date | null;
	completedLessonCount: number;
	totalLessonCount: number;
	createdAt: Date;
	updatedAt: Date | null;
};

export type CreateUnitProgressProps = {
	sectionId: SectionId;
	totalLessonCount: number;
	createdAt: Date;
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
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
		});
	}

	static create(
		id: UnitProgressId,
		props: CreateUnitProgressProps,
	): UnitProgress {
		const progress = new UnitProgress(id, {
			sectionId: props.sectionId,
			completedAt: null,
			completedLessonCount: 0,
			totalLessonCount: props.totalLessonCount,
			createdAt: props.createdAt,
			updatedAt: null,
		});

		progress.addEvent(
			new UnitStartedEvent(progress.userId.toString(), props.createdAt, {
				unitId: progress.unitId.value,
			}),
		);

		return progress;
	}

	completeLesson(now: Date) {
		this._props.updatedAt = now;

		if (this._props.completedAt !== null) {
			return;
		}

		if (++this._props.completedLessonCount !== this._props.totalLessonCount) {
			return;
		}

		this._props.completedAt = now;

		this.addEvent(
			new UnitCompletedEvent(this._id.userId.toString(), now, {
				unitId: this._id.unitId.value,
				sectionId: this._props.sectionId.value,
			}),
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

	get createdAt(): Date {
		return this._props.createdAt;
	}

	get updatedAt(): Date | null {
		return this._props.updatedAt;
	}

	get totalLessonCount(): number {
		return this._props.totalLessonCount;
	}

	get completedLessonCount(): number {
		return this._props.completedLessonCount;
	}
}
