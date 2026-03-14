import { UUID, ValueObject } from '@/domain/common';

type Props = {
	value: UUID;
};

export class ActivityId extends ValueObject<Props> {
	private readonly _brand: 'activityId' = 'activityId';

	get value(): UUID {
		return this._props.value;
	}

	toString(): string {
		return this._props.value.toString();
	}

	static create(value: UUID): ActivityId {
		return new ActivityId({ value });
	}
}
