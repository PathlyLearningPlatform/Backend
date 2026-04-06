import { ValueObject } from "@/domain/common";

type Props = {
	value: string;
};

export class LessonDescription extends ValueObject<Props> {
	get value() {
		return this._props.value;
	}

	static create(value: string): LessonDescription {
		// TODO: validation

		return new LessonDescription({ value: value });
	}
}
