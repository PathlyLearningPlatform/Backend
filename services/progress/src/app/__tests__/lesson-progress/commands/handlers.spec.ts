import { LessonNotFoundException } from '@/app/common';
import {
	RemoveLessonProgressHandler,
	StartLessonHandler,
} from '@/app/lesson-progress/commands';
import {
	LessonProgressNotFoundException,
	UnitNotStartedException,
} from '@/app/lesson-progress/exceptions';
import { APP_TEST_IDS, createEventBusMock } from '../../common/test.utils';

describe('lesson-progress commands', () => {
	it('start creates progress and publishes events', async () => {
		const repository = { save: jest.fn() };
		const unitProgressReadRepository = {
			findForUser: jest.fn().mockResolvedValue({ id: APP_TEST_IDS.unitProgressId }),
		};
		const learningPathsService = {
			findLessonById: jest.fn().mockResolvedValue({
				id: APP_TEST_IDS.lessonId,
				unitId: APP_TEST_IDS.unitId,
				activityCount: 5,
			}),
		};
		const eventBus = createEventBusMock();
		const handler = new StartLessonHandler(
			repository as never,
			unitProgressReadRepository as never,
			learningPathsService as never,
			eventBus as never,
		);

		const result = await handler.execute({
			lessonId: APP_TEST_IDS.lessonId,
			userId: APP_TEST_IDS.userId,
		});

		expect(repository.save).toHaveBeenCalledTimes(1);
		expect(eventBus.publish).toHaveBeenCalledTimes(1);
		expect(result.lessonId).toBe(APP_TEST_IDS.lessonId);
		expect(result.unitId).toBe(APP_TEST_IDS.unitId);
		expect(result.totalActivityCount).toBe(5);
		expect(result.completedActivityCount).toBe(0);
	});

	it('start throws when lesson does not exist', async () => {
		const handler = new StartLessonHandler(
			{ save: jest.fn() } as never,
			{ findForUser: jest.fn() } as never,
			{ findLessonById: jest.fn().mockResolvedValue(null) } as never,
			createEventBusMock() as never,
		);

		await expect(
			handler.execute({
				lessonId: APP_TEST_IDS.lessonId,
				userId: APP_TEST_IDS.userId,
			}),
		).rejects.toBeInstanceOf(LessonNotFoundException);
	});

	it('start throws when unit progress was not started', async () => {
		const handler = new StartLessonHandler(
			{ save: jest.fn() } as never,
			{ findForUser: jest.fn().mockResolvedValue(null) } as never,
			{
				findLessonById: jest.fn().mockResolvedValue({
					id: APP_TEST_IDS.lessonId,
					unitId: APP_TEST_IDS.unitId,
					activityCount: 2,
				}),
			} as never,
			createEventBusMock() as never,
		);

		await expect(
			handler.execute({
				lessonId: APP_TEST_IDS.lessonId,
				userId: APP_TEST_IDS.userId,
			}),
		).rejects.toBeInstanceOf(UnitNotStartedException);
	});

	it('remove deletes lesson progress', async () => {
		const repository = { remove: jest.fn().mockResolvedValue(true) };
		const handler = new RemoveLessonProgressHandler(repository as never);

		await handler.execute({ id: APP_TEST_IDS.lessonProgressId });
		expect(repository.remove).toHaveBeenCalledTimes(1);
	});

	it('remove throws when lesson progress does not exist', async () => {
		const repository = { remove: jest.fn().mockResolvedValue(false) };
		const handler = new RemoveLessonProgressHandler(repository as never);

		await expect(
			handler.execute({ id: APP_TEST_IDS.lessonProgressId }),
		).rejects.toBeInstanceOf(LessonProgressNotFoundException);
	});
});