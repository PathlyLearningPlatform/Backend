import { AggregateRoot, UserId, UUID } from "../common";
import { LessonId } from "../lessons/value-objects";
import { ActivityCompletedEvent } from "./events";
import { ActivityId, ActivityProgressId } from "./value-objects";

export type ActivityProgressProps = {
	lessonId: LessonId;
	completedAt: Date | null;
};

export type ActivityProgressFromDataSourceProps = {
	activityId: string;
	lessonId: string;
	userId: string;
	completedAt: Date | null;
};

export type CreateActivityProgressProps = {
	lessonId: LessonId;
};

export class ActivityProgress extends AggregateRoot<
	ActivityProgressId,
	ActivityProgressProps
> {
	private readonly _props: ActivityProgressProps;

	private constructor(id: ActivityProgressId, props: ActivityProgressProps) {
		super(id);
		this._props = props;
	}

	static fromDataSource(
		props: ActivityProgressFromDataSourceProps,
	): ActivityProgress {
		const activityId = ActivityId.create(props.activityId);
		const lessonId = LessonId.create(props.lessonId);
		const userId = UserId.create(UUID.create(props.userId));
		const id = ActivityProgressId.create(activityId, userId);

		return new ActivityProgress(id, {
			lessonId,
			completedAt: props.completedAt,
		});
	}

	static create(
		id: ActivityProgressId,
		props: CreateActivityProgressProps,
	): ActivityProgress {
		return new ActivityProgress(id, {
			lessonId: props.lessonId,
			completedAt: null,
		});
	}

	complete(now: Date) {
		if (this._props.completedAt !== null) {
			return;
		}

		this._props.completedAt = now;

		this.addEvent(
			new ActivityCompletedEvent(
				this._id.activityId.value,
				this._id.userId.toString(),
				this._props.lessonId.value,
				now,
			),
		);
	}

	get activityId(): ActivityId {
		return this._id.activityId;
	}

	get lessonId(): LessonId {
		return this._props.lessonId;
	}

	get userId(): UserId {
		return this._id.userId;
	}

	get completedAt(): Date | null {
		return this._props.completedAt;
	}
}
