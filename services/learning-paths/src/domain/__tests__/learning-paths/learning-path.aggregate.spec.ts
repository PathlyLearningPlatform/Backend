import { Order } from "../../common/value-objects/order.vo";
import { UUID } from "../../common/value-objects/uuid.vo";
import { LearningPathCannotBeRemovedException } from "../../learning-paths/exceptions/cannot-be-removed.exception";
import { SectionAlreadyExistsException } from "../../learning-paths/exceptions/section-already-exists.exception";
import { LearningPath } from "../../learning-paths/learning-path.aggregate";
import { LearningPathDescription } from "../../learning-paths/value-objects/description.vo";
import { LearningPathId } from "../../learning-paths/value-objects/id.vo";
import { LearningPathName } from "../../learning-paths/value-objects/name.vo";
import { SectionRef } from "../../learning-paths/value-objects/section-ref.vo";
import { SectionId } from "../../sections/value-objects/id.vo";

const makeUuid = (value: string) => new UUID({ value });

const makeLearningPathId = (value = "123e4567-e89b-12d3-a456-426614174000") =>
	new LearningPathId({ value: makeUuid(value) });

const makeSectionId = (value: string) =>
	new SectionId({ value: makeUuid(value) });

const getSectionRefs = (learningPath: LearningPath): SectionRef[] =>
	(learningPath as unknown as { _props: { sectionRefs: SectionRef[] } })._props
		.sectionRefs;

describe("LearningPath aggregate", () => {
	describe("create", () => {
		it("creates learning path with 0 sections", () => {
			const createdAt = new Date("2026-03-10T12:00:00.000Z");
			const id = makeLearningPathId();

			const learningPath = LearningPath.create(id, {
				name: "LP",
				description: "Desc",
				createdAt,
			});

			expect(learningPath.id).toBe(id);
			expect(learningPath.name.value).toBe("LP");
			expect(learningPath.description?.value).toBe("Desc");
			expect(learningPath.createdAt).toBe(createdAt);
			expect(learningPath.updatedAt).toBeNull();
			expect(learningPath.sectionCount).toBe(0);
			expect(getSectionRefs(learningPath)).toHaveLength(0);
		});

		it("sets description to null when not provided", () => {
			const learningPath = LearningPath.create(makeLearningPathId(), {
				name: "LP",
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
			});

			expect(learningPath.description).toBeNull();
		});
	});

	describe("fromDataSource", () => {
		it("sorts section refs by stored order", () => {
			const createdAt = new Date("2026-03-10T12:00:00.000Z");
			const id = makeLearningPathId();

			const s1 = makeSectionId("00000000-0000-0000-0000-000000000001");
			const s2 = makeSectionId("00000000-0000-0000-0000-000000000002");
			const s3 = makeSectionId("00000000-0000-0000-0000-000000000003");

			const learningPath = LearningPath.fromDataSource(id, {
				name: new LearningPathName({ value: "LP" }),
				description: new LearningPathDescription({ value: "Desc" }),
				createdAt,
				updatedAt: null,
				sectionRefs: [
					SectionRef.create({ sectionId: s2, order: Order.create(9) }),
					SectionRef.create({ sectionId: s1, order: Order.create(0) }),
					SectionRef.create({ sectionId: s3, order: Order.create(2) }),
				],
				sectionCount: 3,
			});

			const refs = getSectionRefs(learningPath);
			expect(refs.map((r) => r.sectionId.value)).toEqual([
				s1.value,
				s3.value,
				s2.value,
			]);
			expect(refs.map((r) => r.order.value)).toEqual([0, 1, 2]);
		});
	});

	describe("update", () => {
		it("updates name/description and sets updatedAt", () => {
			const createdAt = new Date("2026-03-10T12:00:00.000Z");
			const now = new Date("2026-03-10T12:05:00.000Z");
			const learningPath = LearningPath.create(makeLearningPathId(), {
				name: "LP",
				description: null,
				createdAt,
			});

			learningPath.update(now, {
				name: new LearningPathName({ value: "LP2" }),
				description: new LearningPathDescription({ value: "Desc2" }),
			});

			expect(learningPath.name.value).toBe("LP2");
			expect(learningPath.description?.value).toBe("Desc2");
			expect(learningPath.updatedAt).toBe(now);
		});

		it("sets updatedAt even when props are missing", () => {
			const learningPath = LearningPath.create(makeLearningPathId(), {
				name: "LP",
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
			});
			const now = new Date("2026-03-10T12:05:00.000Z");

			learningPath.update(now);
			expect(learningPath.updatedAt).toBe(now);
		});
	});

	describe("ensureCanRemove", () => {
		it("does not throw when there are no sections", () => {
			const learningPath = LearningPath.create(makeLearningPathId(), {
				name: "LP",
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
			});

			expect(() => learningPath.ensureCanRemove()).not.toThrow();
		});

		it("throws when there is at least 1 section", () => {
			const learningPath = LearningPath.create(makeLearningPathId(), {
				name: "LP",
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
			});

			learningPath.addSection(
				makeSectionId("00000000-0000-0000-0000-000000000001"),
			);

			expect(() => learningPath.ensureCanRemove()).toThrow(
				LearningPathCannotBeRemovedException,
			);
		});
	});

	describe("addSection", () => {
		it("adds a section and increments sectionCount", () => {
			const learningPath = LearningPath.create(makeLearningPathId(), {
				name: "LP",
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
			});
			const sectionId = makeSectionId("00000000-0000-0000-0000-000000000001");

			const ref = learningPath.addSection(sectionId);

			expect(ref.sectionId.value).toBe(sectionId.value);
			expect(ref.order.value).toBe(0);
			expect(learningPath.sectionCount).toBe(1);
			expect(getSectionRefs(learningPath)).toHaveLength(1);
		});

		it("throws when adding duplicate sectionId", () => {
			const learningPath = LearningPath.create(makeLearningPathId(), {
				name: "LP",
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
			});
			const sectionId = makeSectionId("00000000-0000-0000-0000-000000000001");

			learningPath.addSection(sectionId);

			expect(() => learningPath.addSection(sectionId)).toThrow(
				SectionAlreadyExistsException,
			);
		});
	});

	describe("removeSection", () => {
		it("does nothing when section is not found", () => {
			const learningPath = LearningPath.create(makeLearningPathId(), {
				name: "LP",
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
			});
			const s1 = makeSectionId("00000000-0000-0000-0000-000000000001");
			learningPath.addSection(s1);

			learningPath.removeSection(
				makeSectionId("00000000-0000-0000-0000-000000000999"),
			);

			expect(learningPath.sectionCount).toBe(1);
			expect(
				getSectionRefs(learningPath).map((r) => r.sectionId.value),
			).toEqual([s1.value]);
		});

		it("removes section, rearranges orders, and updates sectionCount", () => {
			const learningPath = LearningPath.create(makeLearningPathId(), {
				name: "LP",
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
			});
			const s1 = makeSectionId("00000000-0000-0000-0000-000000000001");
			const s2 = makeSectionId("00000000-0000-0000-0000-000000000002");
			const s3 = makeSectionId("00000000-0000-0000-0000-000000000003");

			learningPath.addSection(s1);
			learningPath.addSection(s2);
			learningPath.addSection(s3);

			learningPath.removeSection(s2);

			expect(learningPath.sectionCount).toBe(2);
			expect(
				getSectionRefs(learningPath).map((r) => r.sectionId.value),
			).toEqual([s1.value, s3.value]);
			expect(getSectionRefs(learningPath).map((r) => r.order.value)).toEqual([
				0, 1,
			]);
		});
	});

	describe("reorderSection", () => {
		it("returns null when section is not found", () => {
			const learningPath = LearningPath.create(makeLearningPathId(), {
				name: "LP",
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
			});

			const result = learningPath.reorderSection(
				makeSectionId("00000000-0000-0000-0000-000000000001"),
				Order.create(0),
			);

			expect(result).toBeNull();
		});

		it("clamps to [0, last] and rearranges orders", () => {
			const learningPath = LearningPath.create(makeLearningPathId(), {
				name: "LP",
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
			});
			const s1 = makeSectionId("00000000-0000-0000-0000-000000000001");
			const s2 = makeSectionId("00000000-0000-0000-0000-000000000002");
			const s3 = makeSectionId("00000000-0000-0000-0000-000000000003");

			learningPath.addSection(s1);
			learningPath.addSection(s2);
			learningPath.addSection(s3);

			const newOrder = learningPath.reorderSection(s1, Order.create(999));

			expect(newOrder?.value).toBe(2);
			expect(
				getSectionRefs(learningPath).map((r) => r.sectionId.value),
			).toEqual([s2.value, s3.value, s1.value]);
			expect(getSectionRefs(learningPath).map((r) => r.order.value)).toEqual([
				0, 1, 2,
			]);
		});
	});
});
