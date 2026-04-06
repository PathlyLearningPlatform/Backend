import { Order } from "../../common/value-objects/order.vo";
import { UUID } from "../../common/value-objects/uuid.vo";
import { LessonId } from "../../lessons/value-objects/id.vo";
import { UnitDescription } from "../../units/value-objects/description.vo";
import { UnitId } from "../../units/value-objects/id.vo";
import { LessonRef } from "../../units/value-objects/lesson-ref.vo";
import { UnitName } from "../../units/value-objects/name.vo";

const makeUuid = (value: string) => UUID.create(value);

describe("Unit value objects", () => {
	describe("UnitId", () => {
		it("creates a unit ID from a UUID value object", () => {
			const uuid = makeUuid("123e4567-e89b-42d3-a456-426614174000");
			const id = new UnitId({ value: uuid });

			expect(id.value).toBe("123e4567-e89b-42d3-a456-426614174000");
		});

		it("throws when created with an invalid UUID via static create", () => {
			expect(() => UnitId.create("not-a-uuid")).toThrow();
		});

		it("equals another UnitId with the same value", () => {
			const uuid = makeUuid("123e4567-e89b-42d3-a456-426614174000");
			const id1 = new UnitId({ value: uuid });
			const id2 = new UnitId({ value: uuid });

			expect(id1.equals(id2)).toBe(true);
		});

		it("does not equal a UnitId with a different value", () => {
			const id1 = new UnitId({
				value: makeUuid("123e4567-e89b-42d3-a456-426614174000"),
			});
			const id2 = new UnitId({
				value: makeUuid("223e4567-e89b-42d3-a456-426614174000"),
			});

			expect(id1.equals(id2)).toBe(false);
		});
	});

	describe("UnitName", () => {
		it("creates a name value object", () => {
			const name = new UnitName({ value: "My Unit" });

			expect(name.value).toBe("My Unit");
		});

		it("creates via static create method", () => {
			const name = UnitName.create("Another Unit");

			expect(name.value).toBe("Another Unit");
		});

		it("equals another UnitName with the same value", () => {
			const name1 = new UnitName({ value: "Unit" });
			const name2 = new UnitName({ value: "Unit" });

			expect(name1.equals(name2)).toBe(true);
		});

		it("does not equal a UnitName with a different value", () => {
			const name1 = new UnitName({ value: "Unit A" });
			const name2 = new UnitName({ value: "Unit B" });

			expect(name1.equals(name2)).toBe(false);
		});
	});

	describe("UnitDescription", () => {
		it("creates a description value object", () => {
			const desc = new UnitDescription({ value: "A unit description" });

			expect(desc.value).toBe("A unit description");
		});

		it("creates via static create method", () => {
			const desc = UnitDescription.create("Created via static method");

			expect(desc.value).toBe("Created via static method");
		});

		it("equals another UnitDescription with the same value", () => {
			const desc1 = new UnitDescription({ value: "Same" });
			const desc2 = new UnitDescription({ value: "Same" });

			expect(desc1.equals(desc2)).toBe(true);
		});

		it("does not equal a UnitDescription with a different value", () => {
			const desc1 = new UnitDescription({ value: "Desc A" });
			const desc2 = new UnitDescription({ value: "Desc B" });

			expect(desc1.equals(desc2)).toBe(false);
		});
	});

	describe("LessonRef", () => {
		it("creates a lesson reference with lessonId and order", () => {
			const lessonId = LessonId.create("12345678-1234-4234-a456-426614174001");
			const order = Order.create(0);

			const ref = new LessonRef({ lessonId, order });

			expect(ref.lessonId).toBe(lessonId);
			expect(ref.order).toBe(order);
		});

		it("creates via static create method", () => {
			const ref = LessonRef.create({
				lessonId: "12345678-1234-4234-a456-426614174001",
				order: 2,
			});

			expect(ref.lessonId.value).toBe("12345678-1234-4234-a456-426614174001");
			expect(ref.order.value).toBe(2);
		});

		it("equals another LessonRef with the same lessonId and order", () => {
			const lessonId = LessonId.create("12345678-1234-4234-a456-426614174001");
			const order = Order.create(0);

			const ref1 = new LessonRef({ lessonId, order });
			const ref2 = new LessonRef({ lessonId, order });

			expect(ref1.equals(ref2)).toBe(true);
		});

		it("does not equal a LessonRef with a different lessonId", () => {
			const lid1 = LessonId.create("12345678-1234-4234-a456-426614174001");
			const lid2 = LessonId.create("12345678-1234-4234-a456-426614174002");
			const order = Order.create(0);

			const ref1 = new LessonRef({ lessonId: lid1, order });
			const ref2 = new LessonRef({ lessonId: lid2, order });

			expect(ref1.equals(ref2)).toBe(false);
		});

		it("does not equal a LessonRef with a different order", () => {
			const lessonId = LessonId.create("12345678-1234-4234-a456-426614174001");

			const ref1 = new LessonRef({ lessonId, order: Order.create(0) });
			const ref2 = new LessonRef({ lessonId, order: Order.create(1) });

			expect(ref1.equals(ref2)).toBe(false);
		});
	});
});
