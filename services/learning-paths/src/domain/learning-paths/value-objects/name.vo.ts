import { ValueObject } from "@/domain/common";

type Props = {
	value: string;
};

export class LearningPathName extends ValueObject<Props> {
	get value() {
		return this._props.value;
	}

	static create(value: string): LearningPathName {
		// TODO: validation

		return new LearningPathName({ value: value });
	}
}
