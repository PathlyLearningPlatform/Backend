import { ActivityId } from "@/domain/activities/value-objects/id.vo";
import { Order, ValueObject } from "@/domain/common";

type Props = {
	activityId: ActivityId;
	order: Order;
};

type CreateProps = {
	activityId: string;
	order: number;
};

export class ActivityRef extends ValueObject<Props> {
	get activityId(): ActivityId {
		return this._props.activityId;
	}

	get order(): Order {
		return this._props.order;
	}

	static create(props: CreateProps) {
		return new ActivityRef({
			activityId: ActivityId.create(props.activityId),
			order: Order.create(props.order),
		});
	}
}
