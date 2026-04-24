import { UUID, ValueObject } from '@/domain/common';

type Props = {
	value: UUID;
};

export class ProjectSubmissionId extends ValueObject<Props> {
	private readonly _brand: 'projectSubmissionId' = 'projectSubmissionId';

	get value(): string {
		return this._props.value.value;
	}

	static create(value: UUID): ProjectSubmissionId {
		return new ProjectSubmissionId({ value });
	}
}
