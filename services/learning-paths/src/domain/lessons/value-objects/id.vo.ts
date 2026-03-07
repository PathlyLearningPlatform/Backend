import { UUID, ValueObject } from '@/domain/common';

type Props = {
	value: UUID;
};

export class LessonId extends ValueObject<Props> {
	private readonly _brand: 'lessonId' = 'lessonId';

	get value(): string {
		return this._props.value.value;
	}

	static create(value: string): LessonId {
		return new LessonId({ value: UUID.create(value) });
	}
}
