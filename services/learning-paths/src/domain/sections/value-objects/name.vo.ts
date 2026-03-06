import { ValueObject } from '@/domain/common';

type Props = {
	value: string;
};

export class SectionName extends ValueObject<Props> {
	get value() {
		return this._props.value;
	}

	static create(value: string): SectionName {
		// TODO: validation

		return new SectionName({ value: value });
	}
}
