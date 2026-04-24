import { UUID, ValueObject } from '@/domain/common';

type Props = {
	value: UUID;
};

export class ProjectId extends ValueObject<Props> {
	private readonly _brand: 'projectId' = 'projectId';

	get value(): string {
		return this._props.value.value;
	}

	static create(value: UUID): ProjectId {
		return new ProjectId({ value });
	}
}
