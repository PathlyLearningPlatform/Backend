import { UUID } from '../../common/value-objects/uuid.vo';
import { Order } from '../../common/value-objects/order.vo';
import { LearningPathId } from '../../learning-paths/value-objects/id.vo';
import { LearningPathName } from '../../learning-paths/value-objects/name.vo';
import { LearningPathDescription } from '../../learning-paths/value-objects/description.vo';
import { SectionRef } from '../../learning-paths/value-objects/section-ref.vo';
import { SectionId } from '../../sections/value-objects/id.vo';

const makeUuid = (value: string) => UUID.create(value);

describe('LearningPath value objects', () => {
	describe('LearningPathId', () => {
		it('creates a learning path ID from a UUID value object', () => {
			const uuid = UUID.create('123e4567-e89b-42d3-a456-426614174000');
			const id = new LearningPathId({ value: uuid });

			expect(id.value).toBe('123e4567-e89b-42d3-a456-426614174000');
		});

		it('throws when created with an invalid UUID via create', () => {
			expect(() => {
				LearningPathId.create('not-a-uuid');
			}).toThrow();
		});

		it('equals another LearningPathId with the same value', () => {
			const uuid = UUID.create('123e4567-e89b-42d3-a456-426614174000');
			const id1 = new LearningPathId({ value: uuid });
			const id2 = new LearningPathId({ value: uuid });

			expect(id1.equals(id2)).toBe(true);
		});

		it('does not equal another LearningPathId with a different value', () => {
			const uuid1 = UUID.create('123e4567-e89b-42d3-a456-426614174000');
			const uuid2 = UUID.create('223e4567-e89b-42d3-a456-426614174000');
			const id1 = new LearningPathId({ value: uuid1 });
			const id2 = new LearningPathId({ value: uuid2 });

			expect(id1.equals(id2)).toBe(false);
		});
	});

	describe('LearningPathName', () => {
		it('creates a name value object', () => {
			const name = new LearningPathName({ value: 'My Learning Path' });

			expect(name.value).toBe('My Learning Path');
		});

		it('creates via static create method', () => {
			const name = LearningPathName.create('Another Path');

			expect(name.value).toBe('Another Path');
		});

		it('equals another name with the same value', () => {
			const name1 = new LearningPathName({ value: 'Path' });
			const name2 = new LearningPathName({ value: 'Path' });

			expect(name1.equals(name2)).toBe(true);
		});

		it('does not equal a name with a different value', () => {
			const name1 = new LearningPathName({ value: 'Path1' });
			const name2 = new LearningPathName({ value: 'Path2' });

			expect(name1.equals(name2)).toBe(false);
		});
	});

	describe('LearningPathDescription', () => {
		it('creates a description value object', () => {
			const desc = new LearningPathDescription({ value: 'A long description' });

			expect(desc.value).toBe('A long description');
		});

		it('creates via static create method', () => {
			const desc = LearningPathDescription.create('Created via static method');

			expect(desc.value).toBe('Created via static method');
		});

		it('equals another description with the same value', () => {
			const desc1 = new LearningPathDescription({ value: 'Same' });
			const desc2 = new LearningPathDescription({ value: 'Same' });

			expect(desc1.equals(desc2)).toBe(true);
		});

		it('does not equal a description with a different value', () => {
			const desc1 = new LearningPathDescription({ value: 'Desc1' });
			const desc2 = new LearningPathDescription({ value: 'Desc2' });

			expect(desc1.equals(desc2)).toBe(false);
		});
	});

	describe('SectionRef', () => {
		it('creates a section reference with sectionId and order', () => {
			const sectionId = new SectionId({
				value: makeUuid('12345678-1234-4234-a456-426614174001'),
			});
			const order = Order.create(0);

			const ref = SectionRef.create({
				sectionId,
				order,
			});

			expect(ref.sectionId).toBe(sectionId);
			expect(ref.order).toBe(order);
		});

		it('equals another SectionRef with same sectionId and order', () => {
			const sectionId = new SectionId({
				value: makeUuid('12345678-1234-4234-a456-426614174001'),
			});
			const order = Order.create(0);

			const ref1 = SectionRef.create({ sectionId, order });
			const ref2 = SectionRef.create({ sectionId, order });

			expect(ref1.equals(ref2)).toBe(true);
		});

		it('does not equal SectionRef with different sectionId', () => {
			const sid1 = new SectionId({
				value: makeUuid('12345678-1234-4234-a456-426614174001'),
			});
			const sid2 = new SectionId({
				value: makeUuid('12345678-1234-4234-a456-426614174002'),
			});
			const order = Order.create(0);

			const ref1 = SectionRef.create({ sectionId: sid1, order });
			const ref2 = SectionRef.create({ sectionId: sid2, order });

			expect(ref1.equals(ref2)).toBe(false);
		});

		it('does not equal SectionRef with different order', () => {
			const sectionId = new SectionId({
				value: makeUuid('12345678-1234-4234-a456-426614174001'),
			});

			const ref1 = SectionRef.create({
				sectionId,
				order: Order.create(0),
			});
			const ref2 = SectionRef.create({
				sectionId,
				order: Order.create(1),
			});

			expect(ref1.equals(ref2)).toBe(false);
		});
	});
});
