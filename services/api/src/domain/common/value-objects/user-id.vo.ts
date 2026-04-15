import { ValueObject } from '../value-object';
import type { UUID } from './uuid.vo';

type Props = {
	value: UUID;
};

export class UserId extends ValueObject<Props> {
	private readonly _brand: 'userId' = 'userId';

	get value(): UUID {
		return this._props.value;
	}

	toString(): string {
		return this._props.value.value;
	}

	static create(value: UUID): UserId {
		return new UserId({ value });
	}
}
