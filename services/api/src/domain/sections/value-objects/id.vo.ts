import { UUID, ValueObject } from "@/domain/common";

type Props = {
	value: UUID;
};

export class SectionId extends ValueObject<Props> {
	private readonly _brand: "sectionId" = "sectionId";

	get value(): string {
		return this._props.value.value;
	}

	static create(value: string): SectionId {
		return new SectionId({ value: UUID.create(value) });
	}
}
