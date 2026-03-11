import { FindActivityByIdHandler } from '../../../activities/queries/find-by-id.query';
import { ActivityNotFoundException } from '../../../common/exceptions/activity-not-found.exception';
import { ActivityDto } from '../../../activities/dtos';
import { ActivityType } from '@/domain/activities/value-objects/type.vo';
import { mockActivityReadRepo, TEST_IDS, DEFAULT_DATE } from '../../common';

const sampleDto: ActivityDto = {
	id: TEST_IDS.ACTIVITY_ID,
	lessonId: TEST_IDS.LESSON_ID,
	name: 'Test Activity',
	description: null,
	createdAt: DEFAULT_DATE,
	updatedAt: null,
	type: ActivityType.ARTICLE,
	order: 0,
};

describe('FindActivityByIdHandler', () => {
	it('returns the activity when found', async () => {
		const repo = mockActivityReadRepo({
			findById: jest.fn().mockResolvedValue(sampleDto),
		});
		const handler = new FindActivityByIdHandler(repo);

		const result = await handler.execute({ where: { id: TEST_IDS.ACTIVITY_ID } });

		expect(result).toEqual(sampleDto);
		expect(repo.findById).toHaveBeenCalledWith(TEST_IDS.ACTIVITY_ID);
	});

	it('throws ActivityNotFoundException when not found', async () => {
		const repo = mockActivityReadRepo();
		const handler = new FindActivityByIdHandler(repo);

		await expect(
			handler.execute({ where: { id: TEST_IDS.ACTIVITY_ID } }),
		).rejects.toThrow(ActivityNotFoundException);
	});
});
