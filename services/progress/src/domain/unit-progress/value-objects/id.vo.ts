import { UUID, ValueObject } from '@/domain/common';

type Props = {
	value: UUID;
};

export class UnitProgressId extends ValueObject<Props> {
	private readonly _brand: 'unitProgressId' = 'unitProgressId';

	get value(): UUID {
		return this._props.value;
	}

	toString(): string {
		return this._props.value.toString();
	}

	static create(value: UUID): UnitProgressId {
		return new UnitProgressId({ value });
	}
}
