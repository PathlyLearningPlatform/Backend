import { Order, ValueObject } from "@/domain/common";
import { UnitId } from "@/domain/units/value-objects/id.vo";

type Props = {
	unitId: UnitId;
	order: Order;
};

type CreateProps = {
	unitId: string;
	order: number;
};

export class UnitRef extends ValueObject<Props> {
	get unitId(): UnitId {
		return this._props.unitId;
	}

	get order(): Order {
		return this._props.order;
	}

	static create(props: CreateProps) {
		return new UnitRef({
			unitId: UnitId.create(props.unitId),
			order: Order.create(props.order),
		});
	}
}
