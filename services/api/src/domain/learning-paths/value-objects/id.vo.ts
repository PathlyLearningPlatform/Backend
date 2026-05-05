import { UUID, ValueObject } from '@/domain/common';

type Props = {
	value: UUID;
};

export class LearningPathId extends ValueObject<Props> {
	get value(): string {
		return this._props.value.value;
	}

	toString(): string {
		return this._props.value.value;
	}

	static create(value: string | UUID): LearningPathId {
		return new LearningPathId({
			value: typeof value === 'string' ? UUID.create(value) : value,
		});
	}
}
