import { Order } from "../../common/value-objects/order.vo";
import { UUID } from "../../common/value-objects/uuid.vo";
import { LearningPathId } from "../../learning-paths/value-objects/id.vo";
import { SectionCannotBeRemovedException } from "../../sections/exceptions/cannot-be-removed.exception";
import { UnitAlreadyExistsException } from "../../sections/exceptions/unit-already-exists.exception";
import { Section } from "../../sections/section.aggregate";
import { SectionDescription } from "../../sections/value-objects/description.vo";
import { SectionId } from "../../sections/value-objects/id.vo";
import { SectionName } from "../../sections/value-objects/name.vo";
import { UnitRef } from "../../sections/value-objects/unit-ref.vo";
import { UnitId } from "../../units/value-objects/id.vo";

const makeUuid = (value: string) => new UUID({ value });

const makeSectionId = (value = "123e4567-e89b-42d3-a456-426614174000") =>
	new SectionId({ value: makeUuid(value) });

const makeLearningPathId = (value = "223e4567-e89b-42d3-a456-426614174000") =>
	new LearningPathId({ value: makeUuid(value) });

const makeUnitId = (value: string) => UnitId.create(value);

const U1 = "12345678-1234-4234-a456-426614174001";
const U2 = "12345678-1234-4234-a456-426614174002";
const U3 = "12345678-1234-4234-a456-426614174003";
const U_MISSING = "12345678-1234-4234-a456-426614174999";

const getUnitRefs = (section: Section): UnitRef[] =>
	(section as unknown as { _props: { unitRefs: UnitRef[] } })._props.unitRefs;

describe("Section aggregate", () => {
	describe("create", () => {
		it("creates section with 0 units", () => {
			const createdAt = new Date("2026-03-10T12:00:00.000Z");
			const id = makeSectionId();
			const learningPathId = makeLearningPathId();

			const section = Section.create(id, {
				learningPathId,
				name: SectionName.create("My Section"),
				description: SectionDescription.create("A description"),
				createdAt,
				order: Order.create(0),
			});

			expect(section.id).toBe(id);
			expect(section.learningPathId).toBe(learningPathId);
			expect(section.name.value).toBe("My Section");
			expect(section.description?.value).toBe("A description");
			expect(section.createdAt).toBe(createdAt);
			expect(section.updatedAt).toBeNull();
			expect(section.order.value).toBe(0);
			expect(section.unitCount).toBe(0);
			expect(getUnitRefs(section)).toHaveLength(0);
		});

		it("sets description to null when not provided", () => {
			const section = Section.create(makeSectionId(), {
				learningPathId: makeLearningPathId(),
				name: SectionName.create("Section"),
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
				order: Order.create(0),
			});

			expect(section.description).toBeNull();
		});
	});

	describe("fromDataSource", () => {
		it("reconstructs section and normalizes unit ref orders", () => {
			const createdAt = new Date("2026-03-10T12:00:00.000Z");
			const updatedAt = new Date("2026-03-10T13:00:00.000Z");
			const id = makeSectionId();
			const learningPathId = makeLearningPathId();

			const u1 = makeUnitId(U1);
			const u2 = makeUnitId(U2);
			const u3 = makeUnitId(U3);

			const section = Section.fromDataSource({
				id: id.value,
				learningPathId: learningPathId.value,
				name: "My Section",
				description: "Desc",
				createdAt,
				updatedAt,
				order: 2,
				unitRefs: [
					UnitRef.create({ unitId: u1.value, order: 0 }),
					UnitRef.create({ unitId: u2.value, order: 1 }),
					UnitRef.create({ unitId: u3.value, order: 2 }),
				],
				unitCount: 3,
			});

			expect(section.name.value).toBe("My Section");
			expect(section.description?.value).toBe("Desc");
			expect(section.order.value).toBe(2);
			expect(section.createdAt).toBe(createdAt);
			expect(section.updatedAt).toBe(updatedAt);

			const refs = getUnitRefs(section);
			expect(refs.map((r) => r.unitId.value)).toEqual([
				u1.value,
				u2.value,
				u3.value,
			]);
			expect(refs.map((r) => r.order.value)).toEqual([0, 1, 2]);
		});

		it("sets description to null when null is provided", () => {
			const section = Section.fromDataSource({
				id: makeSectionId().value,
				learningPathId: makeLearningPathId().value,
				name: "Section",
				description: null,
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
				updatedAt: null,
				order: 0,
				unitRefs: [],
				unitCount: 0,
			});

			expect(section.description).toBeNull();
		});
	});

	describe("update", () => {
		it("updates name, description and sets updatedAt", () => {
			const now = new Date("2026-03-10T12:05:00.000Z");
			const section = Section.create(makeSectionId(), {
				learningPathId: makeLearningPathId(),
				name: SectionName.create("Old Name"),
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
				order: Order.create(0),
			});

			section.update(now, {
				name: SectionName.create("New Name"),
				description: SectionDescription.create("New Desc"),
			});

			expect(section.name.value).toBe("New Name");
			expect(section.description?.value).toBe("New Desc");
			expect(section.updatedAt).toBe(now);
		});

		it("sets updatedAt even when no props provided", () => {
			const section = Section.create(makeSectionId(), {
				learningPathId: makeLearningPathId(),
				name: SectionName.create("Section"),
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
				order: Order.create(0),
			});
			const now = new Date("2026-03-10T12:05:00.000Z");

			section.update(now);

			expect(section.updatedAt).toBe(now);
		});
	});

	describe("ensureCanRemove", () => {
		it("does not throw when there are no units", () => {
			const section = Section.create(makeSectionId(), {
				learningPathId: makeLearningPathId(),
				name: SectionName.create("Section"),
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
				order: Order.create(0),
			});

			expect(() => section.ensureCanRemove()).not.toThrow();
		});

		it("throws when there is at least 1 unit", () => {
			const section = Section.create(makeSectionId(), {
				learningPathId: makeLearningPathId(),
				name: SectionName.create("Section"),
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
				order: Order.create(0),
			});

			section.addUnit(makeUnitId(U1));

			expect(() => section.ensureCanRemove()).toThrow(
				SectionCannotBeRemovedException,
			);
		});
	});

	describe("addUnit", () => {
		it("adds a unit and increments unitCount", () => {
			const section = Section.create(makeSectionId(), {
				learningPathId: makeLearningPathId(),
				name: SectionName.create("Section"),
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
				order: Order.create(0),
			});
			const unitId = makeUnitId(U1);

			const ref = section.addUnit(unitId);

			expect(ref.unitId.value).toBe(unitId.value);
			expect(ref.order.value).toBe(0);
			expect(section.unitCount).toBe(1);
			expect(getUnitRefs(section)).toHaveLength(1);
		});

		it("assigns incremental orders for multiple units", () => {
			const section = Section.create(makeSectionId(), {
				learningPathId: makeLearningPathId(),
				name: SectionName.create("Section"),
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
				order: Order.create(0),
			});
			const u1 = makeUnitId(U1);
			const u2 = makeUnitId(U2);

			const ref1 = section.addUnit(u1);
			const ref2 = section.addUnit(u2);

			expect(ref1.order.value).toBe(0);
			expect(ref2.order.value).toBe(1);
			expect(section.unitCount).toBe(2);
		});

		it("throws when adding duplicate unitId", () => {
			const section = Section.create(makeSectionId(), {
				learningPathId: makeLearningPathId(),
				name: SectionName.create("Section"),
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
				order: Order.create(0),
			});
			const unitId = makeUnitId(U1);

			section.addUnit(unitId);

			expect(() => section.addUnit(unitId)).toThrow(UnitAlreadyExistsException);
		});
	});

	describe("removeUnit", () => {
		it("does nothing when unit is not found", () => {
			const section = Section.create(makeSectionId(), {
				learningPathId: makeLearningPathId(),
				name: SectionName.create("Section"),
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
				order: Order.create(0),
			});
			const u1 = makeUnitId(U1);
			section.addUnit(u1);

			section.removeUnit(makeUnitId(U_MISSING));

			expect(section.unitCount).toBe(1);
			expect(getUnitRefs(section).map((r) => r.unitId.value)).toEqual([
				u1.value,
			]);
		});

		it("removes unit, rearranges orders, and updates unitCount", () => {
			const section = Section.create(makeSectionId(), {
				learningPathId: makeLearningPathId(),
				name: SectionName.create("Section"),
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
				order: Order.create(0),
			});
			const u1 = makeUnitId(U1);
			const u2 = makeUnitId(U2);
			const u3 = makeUnitId(U3);

			section.addUnit(u1);
			section.addUnit(u2);
			section.addUnit(u3);

			section.removeUnit(u2);

			expect(section.unitCount).toBe(2);
			expect(getUnitRefs(section).map((r) => r.unitId.value)).toEqual([
				u1.value,
				u3.value,
			]);
			expect(getUnitRefs(section).map((r) => r.order.value)).toEqual([0, 1]);
		});
	});

	describe("reorderUnit", () => {
		it("returns null when unit is not found", () => {
			const section = Section.create(makeSectionId(), {
				learningPathId: makeLearningPathId(),
				name: SectionName.create("Section"),
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
				order: Order.create(0),
			});

			const result = section.reorderUnit(makeUnitId(U1), Order.create(0));

			expect(result).toBeNull();
		});

		it("clamps to [0, last] and rearranges orders", () => {
			const section = Section.create(makeSectionId(), {
				learningPathId: makeLearningPathId(),
				name: SectionName.create("Section"),
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
				order: Order.create(0),
			});
			const u1 = makeUnitId(U1);
			const u2 = makeUnitId(U2);
			const u3 = makeUnitId(U3);

			section.addUnit(u1);
			section.addUnit(u2);
			section.addUnit(u3);

			const newOrder = section.reorderUnit(u1, Order.create(999));

			expect(newOrder?.value).toBe(2);
			expect(getUnitRefs(section).map((r) => r.unitId.value)).toEqual([
				u2.value,
				u3.value,
				u1.value,
			]);
			expect(getUnitRefs(section).map((r) => r.order.value)).toEqual([0, 1, 2]);
		});

		it("moves a unit to the beginning", () => {
			const section = Section.create(makeSectionId(), {
				learningPathId: makeLearningPathId(),
				name: SectionName.create("Section"),
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
				order: Order.create(0),
			});
			const u1 = makeUnitId(U1);
			const u2 = makeUnitId(U2);
			const u3 = makeUnitId(U3);

			section.addUnit(u1);
			section.addUnit(u2);
			section.addUnit(u3);

			const newOrder = section.reorderUnit(u3, Order.create(0));

			expect(newOrder?.value).toBe(0);
			expect(getUnitRefs(section).map((r) => r.unitId.value)).toEqual([
				u3.value,
				u1.value,
				u2.value,
			]);
			expect(getUnitRefs(section).map((r) => r.order.value)).toEqual([0, 1, 2]);
		});
	});
});
