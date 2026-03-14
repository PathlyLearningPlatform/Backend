import { UUID, ValueObject } from '@/domain/common';

type Props = {
	value: UUID;
};

export class UnitId extends ValueObject<Props> {
	private readonly _brand: 'unitId' = 'unitId';

	get value(): UUID {
		return this._props.value;
	}

	toString(): string {
		return this._props.value.toString();
	}

	static create(value: UUID): UnitId {
		return new UnitId({ value });
	}
}
