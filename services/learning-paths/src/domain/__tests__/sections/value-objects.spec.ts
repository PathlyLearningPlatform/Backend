import { Order } from "../../common/value-objects/order.vo";
import { UUID } from "../../common/value-objects/uuid.vo";
import { SectionDescription } from "../../sections/value-objects/description.vo";
import { SectionId } from "../../sections/value-objects/id.vo";
import { SectionName } from "../../sections/value-objects/name.vo";
import { UnitRef } from "../../sections/value-objects/unit-ref.vo";
import { UnitId } from "../../units/value-objects/id.vo";

const makeUuid = (value: string) => UUID.create(value);

describe("Section value objects", () => {
	describe("SectionId", () => {
		it("creates a section ID from a UUID value object", () => {
			const uuid = makeUuid("123e4567-e89b-42d3-a456-426614174000");
			const id = new SectionId({ value: uuid });

			expect(id.value).toBe("123e4567-e89b-42d3-a456-426614174000");
		});

		it("throws when created with an invalid UUID via static create", () => {
			expect(() => SectionId.create("not-a-uuid")).toThrow();
		});

		it("equals another SectionId with the same value", () => {
			const uuid = makeUuid("123e4567-e89b-42d3-a456-426614174000");
			const id1 = new SectionId({ value: uuid });
			const id2 = new SectionId({ value: uuid });

			expect(id1.equals(id2)).toBe(true);
		});

		it("does not equal a SectionId with a different value", () => {
			const id1 = new SectionId({
				value: makeUuid("123e4567-e89b-42d3-a456-426614174000"),
			});
			const id2 = new SectionId({
				value: makeUuid("223e4567-e89b-42d3-a456-426614174000"),
			});

			expect(id1.equals(id2)).toBe(false);
		});
	});

	describe("SectionName", () => {
		it("creates a name value object", () => {
			const name = new SectionName({ value: "My Section" });

			expect(name.value).toBe("My Section");
		});

		it("creates via static create method", () => {
			const name = SectionName.create("Another Section");

			expect(name.value).toBe("Another Section");
		});

		it("equals another SectionName with the same value", () => {
			const name1 = new SectionName({ value: "Section" });
			const name2 = new SectionName({ value: "Section" });

			expect(name1.equals(name2)).toBe(true);
		});

		it("does not equal a SectionName with a different value", () => {
			const name1 = new SectionName({ value: "Section A" });
			const name2 = new SectionName({ value: "Section B" });

			expect(name1.equals(name2)).toBe(false);
		});
	});

	describe("SectionDescription", () => {
		it("creates a description value object", () => {
			const desc = new SectionDescription({ value: "A section description" });

			expect(desc.value).toBe("A section description");
		});

		it("creates via static create method", () => {
			const desc = SectionDescription.create("Created via static method");

			expect(desc.value).toBe("Created via static method");
		});

		it("equals another SectionDescription with the same value", () => {
			const desc1 = new SectionDescription({ value: "Same" });
			const desc2 = new SectionDescription({ value: "Same" });

			expect(desc1.equals(desc2)).toBe(true);
		});

		it("does not equal a SectionDescription with a different value", () => {
			const desc1 = new SectionDescription({ value: "Desc A" });
			const desc2 = new SectionDescription({ value: "Desc B" });

			expect(desc1.equals(desc2)).toBe(false);
		});
	});

	describe("UnitRef", () => {
		it("creates a unit reference with unitId and order", () => {
			const unitId = UnitId.create("12345678-1234-4234-a456-426614174001");
			const order = Order.create(0);

			const ref = new UnitRef({ unitId, order });

			expect(ref.unitId).toBe(unitId);
			expect(ref.order).toBe(order);
		});

		it("creates via static create method", () => {
			const ref = UnitRef.create({
				unitId: "12345678-1234-4234-a456-426614174001",
				order: 2,
			});

			expect(ref.unitId.value).toBe("12345678-1234-4234-a456-426614174001");
			expect(ref.order.value).toBe(2);
		});

		it("equals another UnitRef with the same unitId and order", () => {
			const unitId = UnitId.create("12345678-1234-4234-a456-426614174001");
			const order = Order.create(0);

			const ref1 = new UnitRef({ unitId, order });
			const ref2 = new UnitRef({ unitId, order });

			expect(ref1.equals(ref2)).toBe(true);
		});

		it("does not equal a UnitRef with a different unitId", () => {
			const uid1 = UnitId.create("12345678-1234-4234-a456-426614174001");
			const uid2 = UnitId.create("12345678-1234-4234-a456-426614174002");
			const order = Order.create(0);

			const ref1 = new UnitRef({ unitId: uid1, order });
			const ref2 = new UnitRef({ unitId: uid2, order });

			expect(ref1.equals(ref2)).toBe(false);
		});

		it("does not equal a UnitRef with a different order", () => {
			const unitId = UnitId.create("12345678-1234-4234-a456-426614174001");

			const ref1 = new UnitRef({ unitId, order: Order.create(0) });
			const ref2 = new UnitRef({ unitId, order: Order.create(1) });

			expect(ref1.equals(ref2)).toBe(false);
		});
	});
});
