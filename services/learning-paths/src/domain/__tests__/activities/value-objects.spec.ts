import { ActivityDescription } from "../../activities/value-objects/description.vo";
import { ActivityId } from "../../activities/value-objects/id.vo";
import { ActivityName } from "../../activities/value-objects/name.vo";
import { UUID } from "../../common/value-objects/uuid.vo";

const makeUuid = (value: string) => UUID.create(value);

describe("Activity value objects", () => {
	describe("ActivityId", () => {
		it("creates an activity ID from a UUID value object", () => {
			const uuid = makeUuid("123e4567-e89b-42d3-a456-426614174000");
			const id = new ActivityId({ value: uuid });

			expect(id.value).toBe("123e4567-e89b-42d3-a456-426614174000");
		});

		it("throws when created with an invalid UUID via static create", () => {
			expect(() => ActivityId.create("not-a-uuid")).toThrow();
		});

		it("equals another ActivityId with the same value", () => {
			const uuid = makeUuid("123e4567-e89b-42d3-a456-426614174000");
			const id1 = new ActivityId({ value: uuid });
			const id2 = new ActivityId({ value: uuid });

			expect(id1.equals(id2)).toBe(true);
		});

		it("does not equal an ActivityId with a different value", () => {
			const id1 = new ActivityId({
				value: makeUuid("123e4567-e89b-42d3-a456-426614174000"),
			});
			const id2 = new ActivityId({
				value: makeUuid("223e4567-e89b-42d3-a456-426614174000"),
			});

			expect(id1.equals(id2)).toBe(false);
		});
	});

	describe("ActivityName", () => {
		it("creates a name value object", () => {
			const name = new ActivityName({ value: "My Activity" });

			expect(name.value).toBe("My Activity");
		});

		it("creates via static create method", () => {
			const name = ActivityName.create("Another Activity");

			expect(name.value).toBe("Another Activity");
		});

		it("equals another ActivityName with the same value", () => {
			const name1 = new ActivityName({ value: "Activity" });
			const name2 = new ActivityName({ value: "Activity" });

			expect(name1.equals(name2)).toBe(true);
		});

		it("does not equal an ActivityName with a different value", () => {
			const name1 = new ActivityName({ value: "Activity A" });
			const name2 = new ActivityName({ value: "Activity B" });

			expect(name1.equals(name2)).toBe(false);
		});
	});

	describe("ActivityDescription", () => {
		it("creates a description value object", () => {
			const desc = new ActivityDescription({
				value: "An activity description",
			});

			expect(desc.value).toBe("An activity description");
		});

		it("creates via static create method", () => {
			const desc = ActivityDescription.create("Created via static method");

			expect(desc.value).toBe("Created via static method");
		});

		it("equals another ActivityDescription with the same value", () => {
			const desc1 = new ActivityDescription({ value: "Same" });
			const desc2 = new ActivityDescription({ value: "Same" });

			expect(desc1.equals(desc2)).toBe(true);
		});

		it("does not equal an ActivityDescription with a different value", () => {
			const desc1 = new ActivityDescription({ value: "Desc A" });
			const desc2 = new ActivityDescription({ value: "Desc B" });

			expect(desc1.equals(desc2)).toBe(false);
		});
	});
});
