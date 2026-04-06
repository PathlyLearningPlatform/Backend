import { type UserId, ValueObject } from '@/domain/common';
import type { UnitId } from './id.vo';

type Props = {
	unitId: UnitId;
	userId: UserId;
};

export class UnitProgressId extends ValueObject<Props> {
	get unitId(): UnitId {
		return this._props.unitId;
	}

	get userId(): UserId {
		return this._props.userId;
	}

	static create(unitId: UnitId, userId: UserId): UnitProgressId {
		return new UnitProgressId({ unitId, userId });
	}
}
