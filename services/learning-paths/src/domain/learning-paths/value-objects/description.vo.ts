import { ValueObject } from '@/domain/common';

type Props = {
	value: string;
};

export class LearningPathDescription extends ValueObject<Props> {
	get value() {
		return this._props.value;
	}

	static create(value: string): LearningPathDescription {
		// TODO: validation

		return new LearningPathDescription({ value: value });
	}
}
