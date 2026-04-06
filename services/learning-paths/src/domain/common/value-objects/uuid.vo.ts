import { InvalidUUIDException } from "../exceptions";
import { ValueObject } from "../value-object";

type Props = {
	value: string;
};

export class UUID extends ValueObject<Props> {
	get value(): string {
		return this._props.value;
	}

	static create(value: string): UUID {
		const regex =
			/[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}/i;

		if (!regex.test(value)) {
			throw new InvalidUUIDException(value);
		}

		return new UUID({
			value,
		});
	}
}
