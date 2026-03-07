import { DomainException } from '../domain-exception';
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
			new globalThis.URL(value);
		} catch {
			throw new DomainException(`Invalid URL: ${value}`);
		}

		return new Url({ value });
	}
}
