import { ValueObject } from '@/domain/common';

type Props = {
	value: string;
};

export class ActivityName extends ValueObject<Props> {
	get value() {
		return this._props.value;
	}

	static create(value: string): ActivityName {
		// TODO: validation

		return new ActivityName({ value: value });
	}
}
