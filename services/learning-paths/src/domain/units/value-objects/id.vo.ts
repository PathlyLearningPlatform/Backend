import { UUID, ValueObject } from '@/domain/common';

type Props = {
	value: UUID;
};

export class UnitId extends ValueObject<Props> {
	private readonly _brand: 'unitId' = 'unitId';

	get value(): string {
		return this._props.value.value;
	}

	static create(value: string): UnitId {
		return new UnitId({ value: UUID.create(value) });
	}
}
