import { AddLessonHandler } from '../../../units/commands/add-lesson.command';
import { UnitNotFoundException } from '../../../common/exceptions/unit-not-found.exception';
import { mockUnitRepo, mockLessonRepo, makeUnit, TEST_IDS } from '../../common';

describe('AddLessonHandler', () => {
	it('adds a lesson to a unit', async () => {
		const unit = makeUnit();
		const unitRepo = mockUnitRepo({ load: jest.fn().mockResolvedValue(unit) });
		const lessonRepo = mockLessonRepo();
		const handler = new AddLessonHandler(unitRepo, lessonRepo);

		const result = await handler.execute({
			unitId: TEST_IDS.UNIT_ID,
			name: 'New Lesson',
			description: 'Lesson desc',
		});

		expect(result.name).toBe('New Lesson');
		expect(result.description).toBe('Lesson desc');
		expect(result.unitId).toBe(TEST_IDS.UNIT_ID);
		expect(result.order).toBe(0);
		expect(result.activityCount).toBe(0);
		expect(lessonRepo.save).toHaveBeenCalledTimes(1);
		expect(unitRepo.save).toHaveBeenCalledTimes(1);
	});

	it('throws UnitNotFoundException when unit not found', async () => {
		const unitRepo = mockUnitRepo();
		const lessonRepo = mockLessonRepo();
		const handler = new AddLessonHandler(unitRepo, lessonRepo);

		await expect(
			handler.execute({ unitId: TEST_IDS.UNIT_ID, name: 'Lesson' }),
		).rejects.toThrow(UnitNotFoundException);
	});
});
