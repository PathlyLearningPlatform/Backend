import { AggregateRoot, UserId, UUID } from '../common';
import { LessonId } from '../lesson-progress/value-objects';
import { ActivityCompletedEvent } from './events';
import { ActivityId, ActivityProgressId } from './value-objects';

export type ActivityProgressProps = {
	activityId: ActivityId;
	lessonId: LessonId;
	userId: UserId;
	completedAt: Date | null;
};

export type ActivityProgressFromDataSourceProps = {
	id: string;
	activityId: string;
	lessonId: string;
	userId: string;
	completedAt: Date | null;
};

export type CreateActivityProgressProps = {
	activityId: ActivityId;
	lessonId: LessonId;
	userId: UserId;
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
		const id = ActivityProgressId.create(UUID.create(props.id));
		const activityId = ActivityId.create(UUID.create(props.activityId));
		const userId = UserId.create(UUID.create(props.userId));
		const lessonId = LessonId.create(UUID.create(props.lessonId));

		return new ActivityProgress(id, {
			activityId,
			userId,
			lessonId,
			completedAt: props.completedAt,
		});
	}

	static create(
		id: ActivityProgressId,
		props: CreateActivityProgressProps,
	): ActivityProgress {
		return new ActivityProgress(id, {
			activityId: props.activityId,
			completedAt: null,
			lessonId: props.lessonId,
			userId: props.userId,
		});
	}

	get id(): ActivityProgressId {
		return this._id;
	}

	get activityId(): ActivityId {
		return this._props.activityId;
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

	complete(now: Date) {
		if (this._props.completedAt !== null) {
			return;
		}

		this._props.completedAt = now;

		this.addEvent(
			new ActivityCompletedEvent(
				this._props.activityId.value.value,
				this._props.userId.value.value,
				this._props.lessonId.toString(),
				now,
			),
		);
	}
}
