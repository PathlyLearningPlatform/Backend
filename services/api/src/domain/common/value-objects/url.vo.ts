import { InvalidUrlException } from '../exceptions';
import { ValueObject } from '../value-object';

type Props = {
	value: string;
};

export class Url extends ValueObject<Props> {
	get value(): string {
		return this._props.value;
	}

	static create(value: string): Url {
		try {
			new URL(value);
		} catch {
			throw new InvalidUrlException(value);
		}

		return new Url({ value });
	}
}
