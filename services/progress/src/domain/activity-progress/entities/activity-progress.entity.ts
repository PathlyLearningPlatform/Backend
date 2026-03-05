import { DomainEvent } from '@/domain/common';
import { ActivityCompletedEvent } from '../events';

export interface ActivityProgressFields {
	id: string;
	activityId: string;
	lessonId: string;
	userId: string;
	completedAt: Date | null;
}

type RequiredCreateFields = Pick<
	ActivityProgressFields,
	'id' | 'activityId' | 'userId' | 'lessonId'
>;
type AllowedCreateFields = Partial<ActivityProgressFields>;
type CreateFields = RequiredCreateFields & AllowedCreateFields;

export class ActivityProgress implements ActivityProgressFields {
	constructor(fields: CreateFields) {
		this.id = fields.id;
		this.activityId = fields.activityId;
		this.userId = fields.userId;
		this.lessonId = fields.lessonId;
		this.completedAt = fields.completedAt ?? null;
		this._events = [];
	}

	complete(now: Date) {
		if (this.completedAt !== null) {
			return;
		}

		this.completedAt = now;

		this._events.push(
			new ActivityCompletedEvent(this.id, this.userId, this.lessonId),
		);
	}

	private _events: DomainEvent[];

	get events() {
		return [...this._events];
	}

	id: string;
	activityId: string;
	userId: string;
	completedAt: Date | null;
	lessonId: string;
}
