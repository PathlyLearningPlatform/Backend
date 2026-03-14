import { UUID, ValueObject } from '@/domain/common';

type Props = {
	value: UUID;
};

export class LessonProgressId extends ValueObject<Props> {
	private readonly _brand: 'lessonProgressId' = 'lessonProgressId';

	get value(): UUID {
		return this._props.value;
	}

	toString(): string {
		return this._props.value.toString();
	}

	static create(value: UUID): LessonProgressId {
		return new LessonProgressId({ value });
	}
}
