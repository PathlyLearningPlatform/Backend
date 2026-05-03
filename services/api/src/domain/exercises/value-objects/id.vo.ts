import { UUID, ValueObject } from '@/domain/common';

type Props = {
	value: UUID;
};

export class ExerciseId extends ValueObject<Props> {
	private readonly _brand: 'exerciseId' = 'exerciseId';

	get value(): UUID {
		return this._props.value;
	}

	get primitive(): string {
		return this._props.value.value;
	}

	static create(value: UUID): ExerciseId {
		return new ExerciseId({ value });
	}
}
