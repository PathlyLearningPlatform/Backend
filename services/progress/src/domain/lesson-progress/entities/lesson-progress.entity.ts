import { DomainEvent } from '@/domain/common';
import { LessonCompletedEvent } from '../events';

interface Fields {
	id: string;
	lessonId: string;
	userId: string;
	completedAt: Date | null;
	completedActivityCount: number;
	totalActivityCount: number;
}

type CreateFields = Pick<
	Fields,
	'id' | 'userId' | 'lessonId' | 'totalActivityCount'
> &
	Partial<Fields>;

export class LessonProgress {
	private _state: Fields;
	private _events: DomainEvent[];

	constructor(fields: CreateFields) {
		this._state = {
			id: fields.id,
			lessonId: fields.lessonId,
			userId: fields.userId,
			completedActivityCount: fields.completedActivityCount ?? 0,
			completedAt: fields.completedAt ?? null,
			totalActivityCount: fields.totalActivityCount,
		};

		this._events = [];
	}

	completeActivity(now: Date) {
		this._state.completedActivityCount++;

		if (this._state.completedActivityCount !== this._state.totalActivityCount) {
			return;
		}

		if (this._state.completedAt !== null) {
			return;
		}

		this._state.completedAt = now;

		this._events.push(
			new LessonCompletedEvent(this._state.id, this._state.userId),
		);
	}

	get id() {
		return this._state.id;
	}
	get lessonId() {
		return this._state.lessonId;
	}
	get userId() {
		return this._state.userId;
	}
	get completedActivityCount() {
		return this._state.completedActivityCount;
	}
	get completedAt() {
		return this._state.completedAt;
	}
	get events() {
		return [...this._events];
	}
	get totalActivityCount() {
		return this._state.totalActivityCount;
	}
}
