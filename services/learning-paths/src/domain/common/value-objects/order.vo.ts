import { InvalidOrderException } from "../exceptions";
import { ValueObject } from "../value-object";

type Props = {
	value: number;
};

export class Order extends ValueObject<Props> {
	get value(): number {
		return this._props.value;
	}

	static create(value: number): Order {
		if (value < 0) {
			throw new InvalidOrderException(value);
		}

		return new Order({ value });
	}
}
