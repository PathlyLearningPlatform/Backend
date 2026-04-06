import { Order } from "../../../common";
import { InvalidOrderException } from "../../../common/exceptions";

describe("Order value object", () => {
	describe("create", () => {
		it("should return Order value object", () => {
			const validOrder = 0;
			const vo = Order.create(validOrder);

			expect(vo.value).toBe(validOrder);
		});
		it("should throw InvalidOrderException", () => {
			const invalidOrder = -2;

			expect(() => {
				Order.create(invalidOrder);
			}).toThrow(new InvalidOrderException(invalidOrder));
		});
	});

	describe("equals", () => {
		it("should return true", () => {
			const order1 = Order.create(0);
			const order2 = Order.create(0);

			expect(order1.equals(order2)).toBe(true);
			expect(order2.equals(order1)).toBe(true);
		});

		it("should return false", () => {
			const order1 = Order.create(0);
			const order2 = Order.create(1);

			expect(order1.equals(order2)).toBe(false);
			expect(order2.equals(order1)).toBe(false);
		});
	});
});
