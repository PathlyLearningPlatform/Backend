import { FindLessonByIdHandler } from '../../../lessons/queries/find-by-id.query';
import { LessonNotFoundException } from '../../../common/exceptions/lesson-not-found.exception';
import { LessonDto } from '../../../lessons/dtos';
import { mockLessonReadRepo, TEST_IDS, DEFAULT_DATE } from '../../common';

const sampleDto: LessonDto = {
	id: TEST_IDS.LESSON_ID,
	unitId: TEST_IDS.UNIT_ID,
	name: 'Test Lesson',
	description: null,
	createdAt: DEFAULT_DATE,
	updatedAt: null,
	order: 0,
	activityCount: 0,
};

describe('FindLessonByIdHandler', () => {
	it('returns the lesson when found', async () => {
		const repo = mockLessonReadRepo({
			findById: jest.fn().mockResolvedValue(sampleDto),
		});
		const handler = new FindLessonByIdHandler(repo);

		const result = await handler.execute({ where: { id: TEST_IDS.LESSON_ID } });

		expect(result).toEqual(sampleDto);
		expect(repo.findById).toHaveBeenCalledWith(TEST_IDS.LESSON_ID);
	});

	it('throws LessonNotFoundException when not found', async () => {
		const repo = mockLessonReadRepo();
		const handler = new FindLessonByIdHandler(repo);

		await expect(
			handler.execute({ where: { id: TEST_IDS.LESSON_ID } }),
		).rejects.toThrow(LessonNotFoundException);
	});
});
