import { type Order, ValueObject } from "@/domain/common";
import type { SectionId } from "@/domain/sections/value-objects/id.vo";

type Props = {
	sectionId: SectionId;
	order: Order;
};

type CreateProps = {
	sectionId: SectionId;
	order: Order;
};

export class SectionRef extends ValueObject<Props> {
	get sectionId(): SectionId {
		return this._props.sectionId;
	}

	get order(): Order {
		return this._props.order;
	}

	static create(props: CreateProps) {
		return new SectionRef({
			sectionId: props.sectionId,
			order: props.order,
		});
	}
}
