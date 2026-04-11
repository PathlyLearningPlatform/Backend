import { SkillId } from './id.vo';
import { ValueObject, UserId } from '@domain/common';

type Props = {
	skillId: SkillId;
	userId: UserId;
};

export class SkillProgressId extends ValueObject<Props> {
	private readonly _brand: 'skillProgressId' = 'skillProgressId';

	get skillId(): SkillId {
		return this._props.skillId;
	}

	get userId(): UserId {
		return this._props.userId;
	}

	static create(skillId: SkillId, userId: UserId): SkillProgressId {
		return new SkillProgressId({ skillId, userId });
	}
}
