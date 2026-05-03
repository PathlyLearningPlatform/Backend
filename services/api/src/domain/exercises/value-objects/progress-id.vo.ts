import { type UserId, ValueObject } from '@/domain/common';
import type { ExerciseId } from './id.vo';

type Props = {
	exerciseId: ExerciseId;
	userId: UserId;
};

export class ExerciseProgressId extends ValueObject<Props> {
	get exerciseId(): ExerciseId {
		return this._props.exerciseId;
	}

	get userId(): UserId {
		return this._props.userId;
	}

	static create(exerciseId: ExerciseId, userId: UserId): ExerciseProgressId {
		return new ExerciseProgressId({ exerciseId, userId });
	}
}
