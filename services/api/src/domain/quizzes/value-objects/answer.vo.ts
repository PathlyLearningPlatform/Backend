import { UUID, ValueObject } from '@/domain/common';
import { QuestionId } from './question-id.vo';

type Props = {
	questionId: QuestionId;
	text: string;
	isCorrect: boolean;
};

export class Answer extends ValueObject<Props> {
	private readonly _brand: 'answer' = 'answer';

	get questionId(): QuestionId {
		return this._props.questionId;
	}

	get text(): string {
		return this._props.text;
	}

	get isCorrect(): boolean {
		return this._props.isCorrect;
	}

	static create(props: Props): Answer {
		return new Answer({
			questionId: props.questionId,
			text: props.text,
			isCorrect: props.isCorrect,
		});
	}
}
