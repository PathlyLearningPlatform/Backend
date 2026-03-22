import { ValidationException } from '../exceptions';
import { ValueObject } from '../value-object';

type Props = {
	value: string;
};

export class Slug extends ValueObject<Props> {
	private readonly _brand: 'slug' = 'slug';

	get value(): string {
		return this._props.value;
	}

	toString(): string {
		return this._props.value.toString();
	}

	static create(value: string): Slug {
		if (value.length <= 0) {
			throw new ValidationException('slug cannot be an empty string');
		}

		const slug = value
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9 -]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '');

		return new Slug({ value: slug });
	}
}
