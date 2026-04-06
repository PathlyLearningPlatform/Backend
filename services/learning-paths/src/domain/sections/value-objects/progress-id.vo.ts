import { type UserId, ValueObject } from '@/domain/common';
import type { SectionId } from './id.vo';

type Props = {
	sectionId: SectionId;
	userId: UserId;
};

export class SectionProgressId extends ValueObject<Props> {
	get userId(): UserId {
		return this._props.userId;
	}

	get sectionId(): SectionId {
		return this._props.sectionId;
	}

	static create(sectionId: SectionId, userId: UserId): SectionProgressId {
		return new SectionProgressId({ sectionId, userId });
	}
}
