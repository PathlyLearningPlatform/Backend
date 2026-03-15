import { UUID } from './uuid.vo';
import { ValueObject } from '../value-object';

type Props = {
	value: UUID;
};

export class UserId extends ValueObject<Props> {
	private readonly _brand: 'userId' = 'userId';

	get value(): UUID {
		return this._props.value;
	}

	toString(): string {
		return this._props.value.toString();
	}

	static create(value: UUID): UserId {
		return new UserId({ value });
	}
}
