import { UUID, ValueObject } from '@/domain/common';
import { QuestionId } from './question-id.vo';

type Props = {
	questionId: QuestionId;
	text: string;
	isCorrect: boolean | null;
};

export class UserAnswer extends ValueObject<Props> {
	private readonly _brand: 'userAnswer' = 'userAnswer';

	get questionId(): QuestionId {
		return this._props.questionId;
	}

	get text(): string {
		return this._props.text;
	}

	get isCorrect(): boolean | null {
		return this._props.isCorrect;
	}

	static create(props: Props): UserAnswer {
		return new UserAnswer({
			questionId: props.questionId,
			text: props.text,
			isCorrect: props.isCorrect,
		});
	}
}
