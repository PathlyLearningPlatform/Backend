import { InvalidUUIDException } from '../exceptions';
import { ValueObject } from '../value-object';

type Props = {
	value: string;
};

export class UUID extends ValueObject<Props> {
	get value(): string {
		return this._props.value;
	}

	static create(value: string): UUID {
		const regex =
			/^[[:xdigit:]]{8}(?:\-[[:xdigit:]]{4}){3}\-[[:xdigit:]]{12}$/gm;

		if (!regex.test(value)) {
			throw new InvalidUUIDException(value);
		}

		return new UUID({
			value,
		});
	}
}
