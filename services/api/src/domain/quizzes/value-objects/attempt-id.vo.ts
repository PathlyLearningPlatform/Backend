import { UUID, ValueObject } from '@/domain/common';

type Props = {
	value: UUID;
};

export class QuizAttemptId extends ValueObject<Props> {
	private readonly _brand: 'quizAttemptId' = 'quizAttemptId';

	get value(): string {
		return this._props.value.value;
	}

	static create(value: UUID): QuizAttemptId {
		return new QuizAttemptId({ value });
	}
}
