import { ValueObject } from "@/domain/common";

type Props = {
	value: string;
};

export class ActivityDescription extends ValueObject<Props> {
	get value() {
		return this._props.value;
	}

	static create(value: string): ActivityDescription {
		// TODO: validation

		return new ActivityDescription({ value: value });
	}
}
