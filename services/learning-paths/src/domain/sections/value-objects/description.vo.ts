import { ValueObject } from "@/domain/common";

type Props = {
	value: string;
};

export class SectionDescription extends ValueObject<Props> {
	get value() {
		return this._props.value;
	}

	static create(value: string): SectionDescription {
		// TODO: validation

		return new SectionDescription({ value: value });
	}
}
