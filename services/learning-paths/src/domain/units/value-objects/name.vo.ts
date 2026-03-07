import { ValueObject } from '@/domain/common';

type Props = {
	value: string;
};

export class UnitName extends ValueObject<Props> {
	get value() {
		return this._props.value;
	}

	static create(value: string): UnitName {
		// TODO: validation

		return new UnitName({ value: value });
	}
}
