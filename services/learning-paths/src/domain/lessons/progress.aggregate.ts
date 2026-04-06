import { AggregateRoot, UserId, UUID } from "../common";
import { UnitId } from "../units/value-objects/id.vo";
import { LessonCompletedEvent } from "./events";
import { LessonId, LessonProgressId } from "./value-objects";

export type LessonProgressProps = {
	unitId: UnitId;
	completedAt: Date | null;
	completedActivityCount: number;
	totalActivityCount: number;
};

export type LessonProgressFromDataSourceProps = {
	lessonId: string;
	unitId: string;
	userId: string;
	completedAt: Date | null;
	completedActivityCount: number;
	totalActivityCount: number;
};

export type CreateLessonProgressProps = {
	unitId: UnitId;
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
		const lessonId = LessonId.create(props.lessonId);
		const unitId = UnitId.create(props.unitId);
		const userId = UserId.create(UUID.create(props.userId));
		const id = LessonProgressId.create(lessonId, userId);

		return new LessonProgress(id, {
			unitId,
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
			unitId: props.unitId,
			completedAt: null,
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
				this._id.lessonId.value,
				this._props.unitId.value,
				this._id.userId.toString(),
				now,
			),
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

	get totalActivityCount(): number {
		return this._props.totalActivityCount;
	}

	get completedActivityCount(): number {
		return this._props.completedActivityCount;
	}
}
