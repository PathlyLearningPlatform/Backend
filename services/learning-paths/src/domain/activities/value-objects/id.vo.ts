import { UUID, ValueObject } from "@/domain/common";

type Props = {
	value: UUID;
};

export class ActivityId extends ValueObject<Props> {
	private readonly _brand: "activityId" = "activityId";

	get value(): string {
		return this._props.value.value;
	}

	static create(value: string): ActivityId {
		return new ActivityId({ value: UUID.create(value) });
	}
}
