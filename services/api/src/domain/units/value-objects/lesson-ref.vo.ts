import { Order, ValueObject } from "@/domain/common";
import { LessonId } from "@/domain/lessons/value-objects/id.vo";

type Props = {
	lessonId: LessonId;
	order: Order;
};

type CreateProps = {
	lessonId: string;
	order: number;
};

export class LessonRef extends ValueObject<Props> {
	get lessonId(): LessonId {
		return this._props.lessonId;
	}

	get order(): Order {
		return this._props.order;
	}

	static create(props: CreateProps) {
		return new LessonRef({
			lessonId: LessonId.create(props.lessonId),
			order: Order.create(props.order),
		});
	}
}
