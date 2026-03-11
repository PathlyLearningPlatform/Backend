import { Lesson } from '../../lessons/lesson.aggregate';
import { LessonCannotBeRemovedException } from '../../lessons/exceptions/cannot-be-removed.exception';
import { ActivityAlreadyExistsException } from '../../lessons/exceptions/activity-already-exists.exception';
import { LessonId } from '../../lessons/value-objects/id.vo';
import { LessonName } from '../../lessons/value-objects/name.vo';
import { LessonDescription } from '../../lessons/value-objects/description.vo';
import { ActivityRef } from '../../lessons/value-objects/activity-ref.vo';
import { UnitId } from '../../units/value-objects/id.vo';
import { ActivityId } from '../../activities/value-objects/id.vo';
import { UUID } from '../../common/value-objects/uuid.vo';
import { Order } from '../../common/value-objects/order.vo';

const makeUuid = (value: string) => new UUID({ value });

const makeLessonId = (value = '123e4567-e89b-42d3-a456-426614174000') =>
	new LessonId({ value: makeUuid(value) });

const makeUnitId = (value = '223e4567-e89b-42d3-a456-426614174000') =>
	new UnitId({ value: makeUuid(value) });

const makeActivityId = (value: string) => ActivityId.create(value);

const A1 = '12345678-1234-4234-a456-426614174001';
const A2 = '12345678-1234-4234-a456-426614174002';
const A3 = '12345678-1234-4234-a456-426614174003';
const A_MISSING = '12345678-1234-4234-a456-426614174999';

const getActivityRefs = (lesson: Lesson): ActivityRef[] =>
	(lesson as unknown as { _props: { activityRefs: ActivityRef[] } })._props
		.activityRefs;

describe('Lesson aggregate', () => {
	describe('create', () => {
		it('creates lesson with 0 activities', () => {
			const createdAt = new Date('2026-03-10T12:00:00.000Z');
			const id = makeLessonId();
			const unitId = makeUnitId();

			const lesson = Lesson.create(id, {
				unitId,
				name: LessonName.create('My Lesson'),
				description: LessonDescription.create('A description'),
				createdAt,
				order: Order.create(0),
			});

			expect(lesson.id).toBe(id);
			expect(lesson.unitId).toBe(unitId);
			expect(lesson.name.value).toBe('My Lesson');
			expect(lesson.description?.value).toBe('A description');
			expect(lesson.createdAt).toBe(createdAt);
			expect(lesson.updatedAt).toBeNull();
			expect(lesson.order.value).toBe(0);
			expect(lesson.activityCount).toBe(0);
			expect(getActivityRefs(lesson)).toHaveLength(0);
		});

		it('sets description to null when not provided', () => {
			const lesson = Lesson.create(makeLessonId(), {
				unitId: makeUnitId(),
				name: LessonName.create('Lesson'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});

			expect(lesson.description).toBeNull();
		});
	});

	describe('fromDataSource', () => {
		it('reconstructs lesson and normalizes activity ref orders', () => {
			const createdAt = new Date('2026-03-10T12:00:00.000Z');
			const updatedAt = new Date('2026-03-10T13:00:00.000Z');
			const id = makeLessonId();
			const unitId = makeUnitId();

			const a1 = makeActivityId(A1);
			const a2 = makeActivityId(A2);
			const a3 = makeActivityId(A3);

			const lesson = Lesson.fromDataSource({
				id: id.value,
				unitId: unitId.value,
				name: 'My Lesson',
				description: 'Desc',
				createdAt,
				updatedAt,
				order: 1,
				activityRefs: [
					ActivityRef.create({ activityId: a1.value, order: 0 }),
					ActivityRef.create({ activityId: a2.value, order: 1 }),
					ActivityRef.create({ activityId: a3.value, order: 2 }),
				],
				activityCount: 3,
			});

			expect(lesson.name.value).toBe('My Lesson');
			expect(lesson.description?.value).toBe('Desc');
			expect(lesson.order.value).toBe(1);
			expect(lesson.createdAt).toBe(createdAt);
			expect(lesson.updatedAt).toBe(updatedAt);

			const refs = getActivityRefs(lesson);
			expect(refs.map((r) => r.activityId.value)).toEqual([
				a1.value,
				a2.value,
				a3.value,
			]);
			expect(refs.map((r) => r.order.value)).toEqual([0, 1, 2]);
		});

		it('sets description to null when null is provided', () => {
			const lesson = Lesson.fromDataSource({
				id: makeLessonId().value,
				unitId: makeUnitId().value,
				name: 'Lesson',
				description: null,
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				updatedAt: null,
				order: 0,
				activityRefs: [],
				activityCount: 0,
			});

			expect(lesson.description).toBeNull();
		});
	});

	describe('update', () => {
		it('updates name, description and sets updatedAt', () => {
			const now = new Date('2026-03-10T12:05:00.000Z');
			const lesson = Lesson.create(makeLessonId(), {
				unitId: makeUnitId(),
				name: LessonName.create('Old Name'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});

			lesson.update(now, {
				name: LessonName.create('New Name'),
				description: LessonDescription.create('New Desc'),
			});

			expect(lesson.name.value).toBe('New Name');
			expect(lesson.description?.value).toBe('New Desc');
			expect(lesson.updatedAt).toBe(now);
		});

		it('sets updatedAt even when no props provided', () => {
			const lesson = Lesson.create(makeLessonId(), {
				unitId: makeUnitId(),
				name: LessonName.create('Lesson'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const now = new Date('2026-03-10T12:05:00.000Z');

			lesson.update(now);

			expect(lesson.updatedAt).toBe(now);
		});
	});

	describe('ensureCanRemove', () => {
		it('does not throw when there are no activities', () => {
			const lesson = Lesson.create(makeLessonId(), {
				unitId: makeUnitId(),
				name: LessonName.create('Lesson'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});

			expect(() => lesson.ensureCanRemove()).not.toThrow();
		});

		it('throws when there is at least 1 activity', () => {
			const lesson = Lesson.create(makeLessonId(), {
				unitId: makeUnitId(),
				name: LessonName.create('Lesson'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});

			lesson.addActivity(
				makeActivityId(A1),
			);

			expect(() => lesson.ensureCanRemove()).toThrow(
				LessonCannotBeRemovedException,
			);
		});
	});

	describe('addActivity', () => {
		it('adds an activity and increments activityCount', () => {
			const lesson = Lesson.create(makeLessonId(), {
				unitId: makeUnitId(),
				name: LessonName.create('Lesson'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const activityId = makeActivityId(A1);

			const ref = lesson.addActivity(activityId);

			expect(ref.activityId.value).toBe(activityId.value);
			expect(ref.order.value).toBe(0);
			expect(lesson.activityCount).toBe(1);
			expect(getActivityRefs(lesson)).toHaveLength(1);
		});

		it('assigns incremental orders for multiple activities', () => {
			const lesson = Lesson.create(makeLessonId(), {
				unitId: makeUnitId(),
				name: LessonName.create('Lesson'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const a1 = makeActivityId(A1);
			const a2 = makeActivityId(A2);

			const ref1 = lesson.addActivity(a1);
			const ref2 = lesson.addActivity(a2);

			expect(ref1.order.value).toBe(0);
			expect(ref2.order.value).toBe(1);
			expect(lesson.activityCount).toBe(2);
		});

		it('throws when adding duplicate activityId', () => {
			const lesson = Lesson.create(makeLessonId(), {
				unitId: makeUnitId(),
				name: LessonName.create('Lesson'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const activityId = makeActivityId(A1);

			lesson.addActivity(activityId);

			expect(() => lesson.addActivity(activityId)).toThrow(
				ActivityAlreadyExistsException,
			);
		});
	});

	describe('removeActivity', () => {
		it('does nothing when activity is not found', () => {
			const lesson = Lesson.create(makeLessonId(), {
				unitId: makeUnitId(),
				name: LessonName.create('Lesson'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const a1 = makeActivityId(A1);
			lesson.addActivity(a1);

			lesson.removeActivity(
				makeActivityId(A_MISSING),
			);

			expect(lesson.activityCount).toBe(1);
			expect(getActivityRefs(lesson).map((r) => r.activityId.value)).toEqual([
				a1.value,
			]);
		});

		it('removes activity, rearranges orders, and updates activityCount', () => {
			const lesson = Lesson.create(makeLessonId(), {
				unitId: makeUnitId(),
				name: LessonName.create('Lesson'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const a1 = makeActivityId(A1);
			const a2 = makeActivityId(A2);
			const a3 = makeActivityId(A3);

			lesson.addActivity(a1);
			lesson.addActivity(a2);
			lesson.addActivity(a3);

			lesson.removeActivity(a2);

			expect(lesson.activityCount).toBe(2);
			expect(getActivityRefs(lesson).map((r) => r.activityId.value)).toEqual([
				a1.value,
				a3.value,
			]);
			expect(getActivityRefs(lesson).map((r) => r.order.value)).toEqual([0, 1]);
		});
	});

	describe('reorderActivity', () => {
		it('returns null when activity is not found', () => {
			const lesson = Lesson.create(makeLessonId(), {
				unitId: makeUnitId(),
				name: LessonName.create('Lesson'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});

			const result = lesson.reorderActivity(
				makeActivityId(A1),
				Order.create(0),
			);

			expect(result).toBeNull();
		});

		it('clamps to [0, last] and rearranges orders', () => {
			const lesson = Lesson.create(makeLessonId(), {
				unitId: makeUnitId(),
				name: LessonName.create('Lesson'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const a1 = makeActivityId(A1);
			const a2 = makeActivityId(A2);
			const a3 = makeActivityId(A3);

			lesson.addActivity(a1);
			lesson.addActivity(a2);
			lesson.addActivity(a3);

			const newOrder = lesson.reorderActivity(a1, Order.create(999));

			expect(newOrder?.value).toBe(2);
			expect(getActivityRefs(lesson).map((r) => r.activityId.value)).toEqual([
				a2.value,
				a3.value,
				a1.value,
			]);
			expect(getActivityRefs(lesson).map((r) => r.order.value)).toEqual([0, 1, 2]);
		});

		it('moves an activity to the beginning', () => {
			const lesson = Lesson.create(makeLessonId(), {
				unitId: makeUnitId(),
				name: LessonName.create('Lesson'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const a1 = makeActivityId(A1);
			const a2 = makeActivityId(A2);
			const a3 = makeActivityId(A3);

			lesson.addActivity(a1);
			lesson.addActivity(a2);
			lesson.addActivity(a3);

			const newOrder = lesson.reorderActivity(a3, Order.create(0));

			expect(newOrder?.value).toBe(0);
			expect(getActivityRefs(lesson).map((r) => r.activityId.value)).toEqual([
				a3.value,
				a1.value,
				a2.value,
			]);
			expect(getActivityRefs(lesson).map((r) => r.order.value)).toEqual([0, 1, 2]);
		});
	});
});
