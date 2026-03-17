import { ActivityNotFoundException } from '@/app/common';
import {
	CompleteActivityHandler,
	RemoveActivityProgressHandler,
} from '@/app/activity-progress/commands';
import {
	ActivityProgressNotFoundException,
	LessonNotStartedException,
} from '@/app/activity-progress/exceptions';
import {
	APP_TEST_IDS,
	createEventBusMock,
} from '../../common/test.utils';

describe('activity-progress commands', () => {
	describe('CompleteActivityHandler', () => {
		it('creates/completes progress and publishes events', async () => {
			const activityProgressRepository = { save: jest.fn() };
			const lessonProgressReadRepository = {
				findForUser: jest.fn().mockResolvedValue({ id: APP_TEST_IDS.lessonProgressId }),
			};
			const learningPathsService = {
				findActivityById: jest.fn().mockResolvedValue({
					id: APP_TEST_IDS.activityId,
					lessonId: APP_TEST_IDS.lessonId,
				}),
			};
			const eventBus = createEventBusMock();

			const handler = new CompleteActivityHandler(
				activityProgressRepository as never,
				lessonProgressReadRepository as never,
				learningPathsService as never,
				eventBus as never,
			);

			const result = await handler.execute({
				activityId: APP_TEST_IDS.activityId,
				userId: APP_TEST_IDS.userId,
			});

			expect(learningPathsService.findActivityById).toHaveBeenCalledWith(
				APP_TEST_IDS.activityId,
			);
			expect(lessonProgressReadRepository.findForUser).toHaveBeenCalledWith(
				APP_TEST_IDS.lessonId,
				APP_TEST_IDS.userId,
			);
			expect(activityProgressRepository.save).toHaveBeenCalledTimes(1);
			expect(eventBus.publish).toHaveBeenCalledTimes(1);
			expect(result.activityId).toBe(APP_TEST_IDS.activityId);
			expect(result.lessonId).toBe(APP_TEST_IDS.lessonId);
			expect(result.userId).toBe(APP_TEST_IDS.userId);
			expect(result.completedAt).toBeInstanceOf(Date);
		});

		it('throws when activity does not exist', async () => {
			const handler = new CompleteActivityHandler(
				{ save: jest.fn() } as never,
				{ findForUser: jest.fn() } as never,
				{ findActivityById: jest.fn().mockResolvedValue(null) } as never,
				createEventBusMock() as never,
			);

			await expect(
				handler.execute({
					activityId: APP_TEST_IDS.activityId,
					userId: APP_TEST_IDS.userId,
				}),
			).rejects.toBeInstanceOf(ActivityNotFoundException);
		});

		it('throws when lesson progress was not started', async () => {
			const handler = new CompleteActivityHandler(
				{ save: jest.fn() } as never,
				{ findForUser: jest.fn().mockResolvedValue(null) } as never,
				{
					findActivityById: jest.fn().mockResolvedValue({
						id: APP_TEST_IDS.activityId,
						lessonId: APP_TEST_IDS.lessonId,
					}),
				} as never,
				createEventBusMock() as never,
			);

			await expect(
				handler.execute({
					activityId: APP_TEST_IDS.activityId,
					userId: APP_TEST_IDS.userId,
				}),
			).rejects.toBeInstanceOf(LessonNotStartedException);
		});
	});

	describe('RemoveActivityProgressHandler', () => {
		it('removes existing progress', async () => {
			const repository = { remove: jest.fn().mockResolvedValue(true) };
			const handler = new RemoveActivityProgressHandler(repository as never);

			await handler.execute({ id: APP_TEST_IDS.activityProgressId });

			expect(repository.remove).toHaveBeenCalledTimes(1);
		});

		it('throws when progress does not exist', async () => {
			const repository = { remove: jest.fn().mockResolvedValue(false) };
			const handler = new RemoveActivityProgressHandler(repository as never);

			await expect(
				handler.execute({ id: APP_TEST_IDS.activityProgressId }),
			).rejects.toBeInstanceOf(ActivityProgressNotFoundException);
		});
	});
});