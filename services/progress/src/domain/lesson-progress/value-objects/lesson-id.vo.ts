import { UUID, ValueObject } from '@/domain/common';

type Props = {
	value: UUID;
};

export class LessonId extends ValueObject<Props> {
	private readonly _brand: 'lessonId' = 'lessonId';

	get value(): UUID {
		return this._props.value;
	}

	toString(): string {
		return this._props.value.toString();
	}

	static create(value: UUID): LessonId {
		return new LessonId({ value });
	}
}
