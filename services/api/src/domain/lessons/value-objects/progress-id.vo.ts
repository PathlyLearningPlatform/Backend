import { type UserId, ValueObject } from '@/domain/common';
import type { LessonId } from './id.vo';

type Props = {
	lessonId: LessonId;
	userId: UserId;
};

export class LessonProgressId extends ValueObject<Props> {
	get lessonId(): LessonId {
		return this._props.lessonId;
	}

	get userId(): UserId {
		return this._props.userId;
	}

	static create(lessonId: LessonId, userId: UserId): LessonProgressId {
		return new LessonProgressId({ lessonId, userId });
	}
}
