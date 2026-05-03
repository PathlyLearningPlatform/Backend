import { UUID, ValueObject } from '@/domain/common';

type Props = {
	value: UUID;
};

export class ExerciseSubmissionId extends ValueObject<Props> {
	private readonly _brand: 'exerciseSubmissionId' = 'exerciseSubmissionId';

	get value(): UUID {
		return this._props.value;
	}

	get primitive(): string {
		return this._props.value.value;
	}

	static create(value: UUID): ExerciseSubmissionId {
		return new ExerciseSubmissionId({ value });
	}
}
