import { ValueObject, UUID } from '@domain/common';

type Props = {
	value: UUID;
};

export class SkillId extends ValueObject<Props> {
	private readonly _brand: 'skillId' = 'skillId';

	get value(): UUID {
		return this._props.value;
	}

	toString(): string {
		return this._props.value.value;
	}

	static create(value: UUID): SkillId {
		return new SkillId({ value });
	}
}
