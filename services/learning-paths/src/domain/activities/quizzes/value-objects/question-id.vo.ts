import { UUID, ValueObject } from '@/domain/common';

type Props = {
	value: UUID;
};

export class QuestionId extends ValueObject<Props> {
	private readonly _brand: 'questionId' = 'questionId';

	get value(): string {
		return this._props.value.value;
	}

	static create(value: string): QuestionId {
		return new QuestionId({ value: UUID.create(value) });
	}
}
