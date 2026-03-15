import { UUID, ValueObject } from '@/domain/common';

type Props = {
	value: UUID;
};

export class SectionId extends ValueObject<Props> {
	private readonly _brand: 'sectionId' = 'sectionId';

	get value(): UUID {
		return this._props.value;
	}

	toString(): string {
		return this._props.value.toString();
	}

	static create(value: UUID): SectionId {
		return new SectionId({ value });
	}
}
