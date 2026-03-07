import { ValueObject } from '@/domain/common';

type Props = {
	value: string;
};

export class UnitDescription extends ValueObject<Props> {
	get value() {
		return this._props.value;
	}

	static create(value: string): UnitDescription {
		// TODO: validation

		return new UnitDescription({ value: value });
	}
}
