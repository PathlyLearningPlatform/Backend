import { ValueObject } from "@/domain/common";

type Props = {
	value: string;
};

export class LessonName extends ValueObject<Props> {
	get value() {
		return this._props.value;
	}

	static create(value: string): LessonName {
		// TODO: validation

		return new LessonName({ value: value });
	}
}
