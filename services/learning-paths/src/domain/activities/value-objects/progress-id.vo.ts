import { type UserId, ValueObject } from '@/domain/common';
import type { ActivityId } from './id.vo';

type Props = {
	activityId: ActivityId;
	userId: UserId;
};

export class ActivityProgressId extends ValueObject<Props> {
	get activityId(): ActivityId {
		return this._props.activityId;
	}

	get userId(): UserId {
		return this._props.userId;
	}

	static create(activityId: ActivityId, userId: UserId): ActivityProgressId {
		return new ActivityProgressId({ activityId, userId });
	}
}
