import { AggregateRoot, UserId, UUID } from '../common';
import { UnitId } from '../units/value-objects/id.vo';
import { LessonCompletedEvent, LessonStartedEvent } from './events';
import { LessonId, LessonProgressId } from './value-objects';

export type LessonProgressProps = {
	unitId: UnitId;
	completedAt: Date | null;
	completedActivityCount: number;
	totalActivityCount: number;
	createdAt: Date;
	updatedAt: Date | null;
};

export type LessonProgressFromDataSourceProps = {
	lessonId: string;
	unitId: string;
	userId: string;
	completedAt: Date | null;
	completedActivityCount: number;
	totalActivityCount: number;
	createdAt: Date;
	updatedAt: Date | null;
};

export type CreateLessonProgressProps = {
	unitId: UnitId;
	totalActivityCount: number;
	createdAt: Date;
};

export class LessonProgress extends AggregateRoot<
	LessonProgressId,
	LessonProgressProps
> {
	private readonly _props: LessonProgressProps;

	private constructor(id: LessonProgressId, props: LessonProgressProps) {
		super(id);
		this._props = props;
	}

	static fromDataSource(
		props: LessonProgressFromDataSourceProps,
	): LessonProgress {
		const lessonId = LessonId.create(props.lessonId);
		const unitId = UnitId.create(props.unitId);
		const userId = UserId.create(UUID.create(props.userId));
		const id = LessonProgressId.create(lessonId, userId);

		return new LessonProgress(id, {
			unitId,
			completedAt: props.completedAt,
			completedActivityCount: props.completedActivityCount,
			totalActivityCount: props.totalActivityCount,
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
		});
	}

	static create(
		id: LessonProgressId,
		props: CreateLessonProgressProps,
	): LessonProgress {
		const progress = new LessonProgress(id, {
			unitId: props.unitId,
			completedAt: null,
			completedActivityCount: 0,
			totalActivityCount: props.totalActivityCount,
			createdAt: props.createdAt,
			updatedAt: null,
		});

		progress.addEvent(
			new LessonStartedEvent(progress.userId.toString(), props.createdAt, {
				lessonId: progress.lessonId.value,
			}),
		);

		return progress;
	}

	completeActivity(now: Date) {
		this._props.updatedAt = now;

		if (this._props.completedAt !== null) {
			return;
		}

		if (
			++this._props.completedActivityCount !== this._props.totalActivityCount
		) {
			return;
		}

		this._props.completedAt = now;

		this.addEvent(
			new LessonCompletedEvent(this._id.userId.toString(), now, {
				lessonId: this._id.lessonId.value,
				unitId: this._props.unitId.value,
			}),
		);
	}

	get lessonId(): LessonId {
		return this._id.lessonId;
	}

	get unitId(): UnitId {
		return this._props.unitId;
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

	get totalActivityCount(): number {
		return this._props.totalActivityCount;
	}

	get completedActivityCount(): number {
		return this._props.completedActivityCount;
	}
}
