import { UUID, ValueObject } from '@/domain/common';

type Props = {
	value: UUID;
};

export class LearningPathId extends ValueObject<Props> {
	private readonly _brand: 'learningPathId' = 'learningPathId';

	get value(): string {
		return this._props.value.value;
	}

	static create(value: string): LearningPathId {
		return new LearningPathId({ value: UUID.create(value) });
	}
}
