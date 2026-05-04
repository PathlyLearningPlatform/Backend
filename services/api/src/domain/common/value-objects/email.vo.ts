import { ValueObject } from '../value-object';

type Props = {
	value: string;
};

export class Email extends ValueObject<Props> {
	get value(): string {
		return this._props.value;
	}

	static create(value: string): Email {
		// TODO: email validation

		return new Email({ value });
	}
}
