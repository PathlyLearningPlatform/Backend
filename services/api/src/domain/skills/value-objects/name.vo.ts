import { ValueObject } from '@domain/common';

type Props = {
	value: string;
};

export class SkillName extends ValueObject<Props> {
	get value(): string {
		return this._props.value;
	}

	toString(): string {
		return this._props.value.toString();
	}

	static create(value: string): SkillName {
		return new SkillName({ value });
	}
}
