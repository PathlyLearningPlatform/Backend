import { AggregateRoot, UserId, UUID } from '../common';
import { LessonId } from '../lessons/value-objects';
import { ActivityCompletedEvent } from './events';
import { ActivityId, ActivityProgressId } from './value-objects';

export type ActivityProgressProps = {
	lessonId: LessonId;
	completedAt: Date | null;
	createdAt: Date;
	updatedAt: Date | null;
};

export type ActivityProgressFromDataSourceProps = {
	activityId: string;
	lessonId: string;
	userId: string;
	completedAt: Date | null;
	createdAt: Date;
	updatedAt: Date | null;
};

export type CreateActivityProgressProps = {
	lessonId: LessonId;
	createdAt: Date;
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
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
		});
	}

	static create(
		id: ActivityProgressId,
		props: CreateActivityProgressProps,
	): ActivityProgress {
		return new ActivityProgress(id, {
			lessonId: props.lessonId,
			completedAt: null,
			createdAt: props.createdAt,
			updatedAt: null,
		});
	}

	complete(now: Date) {
		this._props.updatedAt = now;

		if (this._props.completedAt !== null) {
			return;
		}

		this._props.completedAt = now;

		this.addEvent(
			new ActivityCompletedEvent(this._id.userId.toString(), now, {
				activityId: this._id.activityId.value,
				lessonId: this._props.lessonId.value,
			}),
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

	get createdAt(): Date {
		return this._props.createdAt;
	}

	get updatedAt(): Date | null {
		return this._props.updatedAt;
	}
}
