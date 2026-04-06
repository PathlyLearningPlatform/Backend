import { ActivityId } from "../../activities/value-objects/id.vo";
import { Order } from "../../common/value-objects/order.vo";
import { UUID } from "../../common/value-objects/uuid.vo";
import { ActivityRef } from "../../lessons/value-objects/activity-ref.vo";
import { LessonDescription } from "../../lessons/value-objects/description.vo";
import { LessonId } from "../../lessons/value-objects/id.vo";
import { LessonName } from "../../lessons/value-objects/name.vo";

const makeUuid = (value: string) => UUID.create(value);

describe("Lesson value objects", () => {
	describe("LessonId", () => {
		it("creates a lesson ID from a UUID value object", () => {
			const uuid = makeUuid("123e4567-e89b-42d3-a456-426614174000");
			const id = new LessonId({ value: uuid });

			expect(id.value).toBe("123e4567-e89b-42d3-a456-426614174000");
		});

		it("throws when created with an invalid UUID via static create", () => {
			expect(() => LessonId.create("not-a-uuid")).toThrow();
		});

		it("equals another LessonId with the same value", () => {
			const uuid = makeUuid("123e4567-e89b-42d3-a456-426614174000");
			const id1 = new LessonId({ value: uuid });
			const id2 = new LessonId({ value: uuid });

			expect(id1.equals(id2)).toBe(true);
		});

		it("does not equal a LessonId with a different value", () => {
			const id1 = new LessonId({
				value: makeUuid("123e4567-e89b-42d3-a456-426614174000"),
			});
			const id2 = new LessonId({
				value: makeUuid("223e4567-e89b-42d3-a456-426614174000"),
			});

			expect(id1.equals(id2)).toBe(false);
		});
	});

	describe("LessonName", () => {
		it("creates a name value object", () => {
			const name = new LessonName({ value: "My Lesson" });

			expect(name.value).toBe("My Lesson");
		});

		it("creates via static create method", () => {
			const name = LessonName.create("Another Lesson");

			expect(name.value).toBe("Another Lesson");
		});

		it("equals another LessonName with the same value", () => {
			const name1 = new LessonName({ value: "Lesson" });
			const name2 = new LessonName({ value: "Lesson" });

			expect(name1.equals(name2)).toBe(true);
		});

		it("does not equal a LessonName with a different value", () => {
			const name1 = new LessonName({ value: "Lesson A" });
			const name2 = new LessonName({ value: "Lesson B" });

			expect(name1.equals(name2)).toBe(false);
		});
	});

	describe("LessonDescription", () => {
		it("creates a description value object", () => {
			const desc = new LessonDescription({ value: "A lesson description" });

			expect(desc.value).toBe("A lesson description");
		});

		it("creates via static create method", () => {
			const desc = LessonDescription.create("Created via static method");

			expect(desc.value).toBe("Created via static method");
		});

		it("equals another LessonDescription with the same value", () => {
			const desc1 = new LessonDescription({ value: "Same" });
			const desc2 = new LessonDescription({ value: "Same" });

			expect(desc1.equals(desc2)).toBe(true);
		});

		it("does not equal a LessonDescription with a different value", () => {
			const desc1 = new LessonDescription({ value: "Desc A" });
			const desc2 = new LessonDescription({ value: "Desc B" });

			expect(desc1.equals(desc2)).toBe(false);
		});
	});

	describe("ActivityRef", () => {
		it("creates an activity reference with activityId and order", () => {
			const activityId = ActivityId.create(
				"12345678-1234-4234-a456-426614174001",
			);
			const order = Order.create(0);

			const ref = new ActivityRef({ activityId, order });

			expect(ref.activityId).toBe(activityId);
			expect(ref.order).toBe(order);
		});

		it("creates via static create method", () => {
			const ref = ActivityRef.create({
				activityId: "12345678-1234-4234-a456-426614174001",
				order: 2,
			});

			expect(ref.activityId.value).toBe("12345678-1234-4234-a456-426614174001");
			expect(ref.order.value).toBe(2);
		});

		it("equals another ActivityRef with the same activityId and order", () => {
			const activityId = ActivityId.create(
				"12345678-1234-4234-a456-426614174001",
			);
			const order = Order.create(0);

			const ref1 = new ActivityRef({ activityId, order });
			const ref2 = new ActivityRef({ activityId, order });

			expect(ref1.equals(ref2)).toBe(true);
		});

		it("does not equal an ActivityRef with a different activityId", () => {
			const aid1 = ActivityId.create("12345678-1234-4234-a456-426614174001");
			const aid2 = ActivityId.create("12345678-1234-4234-a456-426614174002");
			const order = Order.create(0);

			const ref1 = new ActivityRef({ activityId: aid1, order });
			const ref2 = new ActivityRef({ activityId: aid2, order });

			expect(ref1.equals(ref2)).toBe(false);
		});

		it("does not equal an ActivityRef with a different order", () => {
			const activityId = ActivityId.create(
				"12345678-1234-4234-a456-426614174001",
			);

			const ref1 = new ActivityRef({ activityId, order: Order.create(0) });
			const ref2 = new ActivityRef({ activityId, order: Order.create(1) });

			expect(ref1.equals(ref2)).toBe(false);
		});
	});
});
