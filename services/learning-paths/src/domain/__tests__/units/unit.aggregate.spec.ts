import { Unit } from '../../units/unit.aggregate';
import { UnitCannotBeRemovedException } from '../../units/exceptions/cannot-be-removed.exception';
import { LessonAlreadyExistsException } from '../../units/exceptions/lesson-already-exists.exception';
import { UnitId } from '../../units/value-objects/id.vo';
import { UnitName } from '../../units/value-objects/name.vo';
import { UnitDescription } from '../../units/value-objects/description.vo';
import { LessonRef } from '../../units/value-objects/lesson-ref.vo';
import { SectionId } from '../../sections/value-objects/id.vo';
import { LessonId } from '../../lessons/value-objects/id.vo';
import { UUID } from '../../common/value-objects/uuid.vo';
import { Order } from '../../common/value-objects/order.vo';

const makeUuid = (value: string) => new UUID({ value });

const makeUnitId = (value = '123e4567-e89b-42d3-a456-426614174000') =>
	new UnitId({ value: makeUuid(value) });

const makeSectionId = (value = '223e4567-e89b-42d3-a456-426614174000') =>
	new SectionId({ value: makeUuid(value) });

const makeLessonId = (value: string) => LessonId.create(value);

const L1 = '12345678-1234-4234-a456-426614174001';
const L2 = '12345678-1234-4234-a456-426614174002';
const L3 = '12345678-1234-4234-a456-426614174003';
const L_MISSING = '12345678-1234-4234-a456-426614174999';

const getLessonRefs = (unit: Unit): LessonRef[] =>
	(unit as unknown as { _props: { lessonRefs: LessonRef[] } })._props.lessonRefs;

describe('Unit aggregate', () => {
	describe('create', () => {
		it('creates unit with 0 lessons', () => {
			const createdAt = new Date('2026-03-10T12:00:00.000Z');
			const id = makeUnitId();
			const sectionId = makeSectionId();

			const unit = Unit.create(id, {
				sectionId,
				name: UnitName.create('My Unit'),
				description: UnitDescription.create('A description'),
				createdAt,
				order: Order.create(0),
			});

			expect(unit.id).toBe(id);
			expect(unit.sectionId).toBe(sectionId);
			expect(unit.name.value).toBe('My Unit');
			expect(unit.description?.value).toBe('A description');
			expect(unit.createdAt).toBe(createdAt);
			expect(unit.updatedAt).toBeNull();
			expect(unit.order.value).toBe(0);
			expect(unit.lessonCount).toBe(0);
			expect(getLessonRefs(unit)).toHaveLength(0);
		});

		it('sets description to null when not provided', () => {
			const unit = Unit.create(makeUnitId(), {
				sectionId: makeSectionId(),
				name: UnitName.create('Unit'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});

			expect(unit.description).toBeNull();
		});
	});

	describe('fromDataSource', () => {
		it('reconstructs unit and normalizes lesson ref orders', () => {
			const createdAt = new Date('2026-03-10T12:00:00.000Z');
			const updatedAt = new Date('2026-03-10T13:00:00.000Z');
			const id = makeUnitId();
			const sectionId = makeSectionId();

			const l1 = makeLessonId(L1);
			const l2 = makeLessonId(L2);
			const l3 = makeLessonId(L3);

			const unit = Unit.fromDataSource({
				id: id.value,
				sectionId: sectionId.value,
				name: 'My Unit',
				description: 'Desc',
				createdAt,
				updatedAt,
				order: 1,
				lessonRefs: [
					LessonRef.create({ lessonId: l1.value, order: 0 }),
					LessonRef.create({ lessonId: l2.value, order: 1 }),
					LessonRef.create({ lessonId: l3.value, order: 2 }),
				],
				lessonCount: 3,
			});

			expect(unit.name.value).toBe('My Unit');
			expect(unit.description?.value).toBe('Desc');
			expect(unit.order.value).toBe(1);
			expect(unit.createdAt).toBe(createdAt);
			expect(unit.updatedAt).toBe(updatedAt);

			const refs = getLessonRefs(unit);
			expect(refs.map((r) => r.lessonId.value)).toEqual([
				l1.value,
				l2.value,
				l3.value,
			]);
			expect(refs.map((r) => r.order.value)).toEqual([0, 1, 2]);
		});

		it('sets description to null when null is provided', () => {
			const unit = Unit.fromDataSource({
				id: makeUnitId().value,
				sectionId: makeSectionId().value,
				name: 'Unit',
				description: null,
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				updatedAt: null,
				order: 0,
				lessonRefs: [],
				lessonCount: 0,
			});

			expect(unit.description).toBeNull();
		});
	});

	describe('update', () => {
		it('updates name, description and sets updatedAt', () => {
			const now = new Date('2026-03-10T12:05:00.000Z');
			const unit = Unit.create(makeUnitId(), {
				sectionId: makeSectionId(),
				name: UnitName.create('Old Name'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});

			unit.update(now, {
				name: UnitName.create('New Name'),
				description: UnitDescription.create('New Desc'),
			});

			expect(unit.name.value).toBe('New Name');
			expect(unit.description?.value).toBe('New Desc');
			expect(unit.updatedAt).toBe(now);
		});

		it('sets updatedAt even when no props provided', () => {
			const unit = Unit.create(makeUnitId(), {
				sectionId: makeSectionId(),
				name: UnitName.create('Unit'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const now = new Date('2026-03-10T12:05:00.000Z');

			unit.update(now);

			expect(unit.updatedAt).toBe(now);
		});
	});

	describe('ensureCanRemove', () => {
		it('does not throw when there are no lessons', () => {
			const unit = Unit.create(makeUnitId(), {
				sectionId: makeSectionId(),
				name: UnitName.create('Unit'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});

			expect(() => unit.ensureCanRemove()).not.toThrow();
		});

		it('throws when there is at least 1 lesson', () => {
			const unit = Unit.create(makeUnitId(), {
				sectionId: makeSectionId(),
				name: UnitName.create('Unit'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});

			unit.addLesson(makeLessonId(L1));

			expect(() => unit.ensureCanRemove()).toThrow(UnitCannotBeRemovedException);
		});
	});

	describe('addLesson', () => {
		it('adds a lesson and increments lessonCount', () => {
			const unit = Unit.create(makeUnitId(), {
				sectionId: makeSectionId(),
				name: UnitName.create('Unit'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const lessonId = makeLessonId(L1);

			const ref = unit.addLesson(lessonId);

			expect(ref.lessonId.value).toBe(lessonId.value);
			expect(ref.order.value).toBe(0);
			expect(unit.lessonCount).toBe(1);
			expect(getLessonRefs(unit)).toHaveLength(1);
		});

		it('assigns incremental orders for multiple lessons', () => {
			const unit = Unit.create(makeUnitId(), {
				sectionId: makeSectionId(),
				name: UnitName.create('Unit'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const l1 = makeLessonId(L1);
			const l2 = makeLessonId(L2);

			const ref1 = unit.addLesson(l1);
			const ref2 = unit.addLesson(l2);

			expect(ref1.order.value).toBe(0);
			expect(ref2.order.value).toBe(1);
			expect(unit.lessonCount).toBe(2);
		});

		it('throws when adding duplicate lessonId', () => {
			const unit = Unit.create(makeUnitId(), {
				sectionId: makeSectionId(),
				name: UnitName.create('Unit'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const lessonId = makeLessonId(L1);

			unit.addLesson(lessonId);

			expect(() => unit.addLesson(lessonId)).toThrow(
				LessonAlreadyExistsException,
			);
		});
	});

	describe('removeLesson', () => {
		it('does nothing when lesson is not found', () => {
			const unit = Unit.create(makeUnitId(), {
				sectionId: makeSectionId(),
				name: UnitName.create('Unit'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const l1 = makeLessonId(L1);
			unit.addLesson(l1);

			unit.removeLesson(makeLessonId(L_MISSING));

			expect(unit.lessonCount).toBe(1);
			expect(getLessonRefs(unit).map((r) => r.lessonId.value)).toEqual([
				l1.value,
			]);
		});

		it('removes lesson, rearranges orders, and updates lessonCount', () => {
			const unit = Unit.create(makeUnitId(), {
				sectionId: makeSectionId(),
				name: UnitName.create('Unit'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const l1 = makeLessonId(L1);
			const l2 = makeLessonId(L2);
			const l3 = makeLessonId(L3);

			unit.addLesson(l1);
			unit.addLesson(l2);
			unit.addLesson(l3);

			unit.removeLesson(l2);

			expect(unit.lessonCount).toBe(2);
			expect(getLessonRefs(unit).map((r) => r.lessonId.value)).toEqual([
				l1.value,
				l3.value,
			]);
			expect(getLessonRefs(unit).map((r) => r.order.value)).toEqual([0, 1]);
		});
	});

	describe('reorderLesson', () => {
		it('returns null when lesson is not found', () => {
			const unit = Unit.create(makeUnitId(), {
				sectionId: makeSectionId(),
				name: UnitName.create('Unit'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});

			const result = unit.reorderLesson(
				makeLessonId(L1),
				Order.create(0),
			);

			expect(result).toBeNull();
		});

		it('clamps to [0, last] and rearranges orders', () => {
			const unit = Unit.create(makeUnitId(), {
				sectionId: makeSectionId(),
				name: UnitName.create('Unit'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const l1 = makeLessonId(L1);
			const l2 = makeLessonId(L2);
			const l3 = makeLessonId(L3);

			unit.addLesson(l1);
			unit.addLesson(l2);
			unit.addLesson(l3);

			const newOrder = unit.reorderLesson(l1, Order.create(999));

			expect(newOrder?.value).toBe(2);
			expect(getLessonRefs(unit).map((r) => r.lessonId.value)).toEqual([
				l2.value,
				l3.value,
				l1.value,
			]);
			expect(getLessonRefs(unit).map((r) => r.order.value)).toEqual([0, 1, 2]);
		});

		it('moves a lesson to the beginning', () => {
			const unit = Unit.create(makeUnitId(), {
				sectionId: makeSectionId(),
				name: UnitName.create('Unit'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const l1 = makeLessonId(L1);
			const l2 = makeLessonId(L2);
			const l3 = makeLessonId(L3);

			unit.addLesson(l1);
			unit.addLesson(l2);
			unit.addLesson(l3);

			const newOrder = unit.reorderLesson(l3, Order.create(0));

			expect(newOrder?.value).toBe(0);
			expect(getLessonRefs(unit).map((r) => r.lessonId.value)).toEqual([
				l3.value,
				l1.value,
				l2.value,
			]);
			expect(getLessonRefs(unit).map((r) => r.order.value)).toEqual([0, 1, 2]);
		});
	});
});
