import { AggregateRoot, UserId, UUID } from '../common';
import { UnitId } from '../unit-progress';
import { LessonCompletedEvent } from './events';
import { LessonId, LessonProgressId } from './value-objects';

export type LessonProgressProps = {
	unitId: UnitId;
	lessonId: LessonId;
	userId: UserId;
	completedAt: Date | null;
	completedActivityCount: number;
	totalActivityCount: number;
};

export type LessonProgressFromDataSourceProps = {
	id: string;
	unitId: string;
	lessonId: string;
	userId: string;
	completedAt: Date | null;
	completedActivityCount: number;
	totalActivityCount: number;
};

export type CreateLessonProgressProps = {
	unitId: UnitId;
	lessonId: LessonId;
	userId: UserId;
	totalActivityCount: number;
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
		const id = LessonProgressId.create(UUID.create(props.id));
		const unitId = UnitId.create(UUID.create(props.unitId));
		const userId = UserId.create(UUID.create(props.userId));
		const lessonId = LessonId.create(UUID.create(props.lessonId));

		return new LessonProgress(id, {
			unitId,
			userId,
			lessonId,
			completedAt: props.completedAt,
			completedActivityCount: props.completedActivityCount,
			totalActivityCount: props.totalActivityCount,
		});
	}

	static create(
		id: LessonProgressId,
		props: CreateLessonProgressProps,
	): LessonProgress {
		return new LessonProgress(id, {
			lessonId: props.lessonId,
			completedAt: null,
			unitId: props.unitId,
			userId: props.userId,
			completedActivityCount: 0,
			totalActivityCount: props.totalActivityCount,
		});
	}

	completeActivity(now: Date) {
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
			new LessonCompletedEvent(
				this._props.lessonId.toString(),
				this._props.unitId.toString(),
				this._props.userId.toString(),
				now,
			),
		);
	}

	get id(): LessonProgressId {
		return this._id;
	}

	get unitId(): UnitId {
		return this._props.unitId;
	}

	get lessonId(): LessonId {
		return this._props.lessonId;
	}

	get userId(): UserId {
		return this._props.userId;
	}

	get completedAt(): Date | null {
		return this._props.completedAt;
	}

	get totalActivityCount(): number {
		return this._props.totalActivityCount;
	}

	get completedActivityCount(): number {
		return this._props.completedActivityCount;
	}
}
