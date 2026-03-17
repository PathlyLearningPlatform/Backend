import { SectionNotFoundException } from '@/app/common';
import {
	RemoveSectionProgressHandler,
	StartSectionHandler,
} from '@/app/section-progress/commands';
import {
	LearningPathNotStartedException,
	SectionProgressNotFoundException,
} from '@/app/section-progress/exceptions';
import { APP_TEST_IDS, createEventBusMock } from '../../common/test.utils';

describe('section-progress commands', () => {
	it('start creates progress and publishes events', async () => {
		const repository = { save: jest.fn() };
		const learningPathProgressReadRepository = {
			findForUser: jest.fn().mockResolvedValue({
				id: APP_TEST_IDS.learningPathProgressId,
			}),
		};
		const learningPathsService = {
			findSectionById: jest.fn().mockResolvedValue({
				id: APP_TEST_IDS.sectionId,
				learningPathId: APP_TEST_IDS.learningPathId,
				unitCount: 3,
			}),
		};
		const eventBus = createEventBusMock();
		const handler = new StartSectionHandler(
			repository as never,
			learningPathProgressReadRepository as never,
			learningPathsService as never,
			eventBus as never,
		);

		const result = await handler.execute({
			sectionId: APP_TEST_IDS.sectionId,
			userId: APP_TEST_IDS.userId,
		});

		expect(repository.save).toHaveBeenCalledTimes(1);
		expect(eventBus.publish).toHaveBeenCalledTimes(1);
		expect(result.sectionId).toBe(APP_TEST_IDS.sectionId);
		expect(result.learningPathId).toBe(APP_TEST_IDS.learningPathId);
		expect(result.totalUnitCount).toBe(3);
		expect(result.completedUnitCount).toBe(0);
	});

	it('start throws when section does not exist', async () => {
		const handler = new StartSectionHandler(
			{ save: jest.fn() } as never,
			{ findForUser: jest.fn() } as never,
			{ findSectionById: jest.fn().mockResolvedValue(null) } as never,
			createEventBusMock() as never,
		);

		await expect(
			handler.execute({
				sectionId: APP_TEST_IDS.sectionId,
				userId: APP_TEST_IDS.userId,
			}),
		).rejects.toBeInstanceOf(SectionNotFoundException);
	});

	it('start throws when learning path progress was not started', async () => {
		const handler = new StartSectionHandler(
			{ save: jest.fn() } as never,
			{ findForUser: jest.fn().mockResolvedValue(null) } as never,
			{
				findSectionById: jest.fn().mockResolvedValue({
					id: APP_TEST_IDS.sectionId,
					learningPathId: APP_TEST_IDS.learningPathId,
					unitCount: 1,
				}),
			} as never,
			createEventBusMock() as never,
		);

		await expect(
			handler.execute({
				sectionId: APP_TEST_IDS.sectionId,
				userId: APP_TEST_IDS.userId,
			}),
		).rejects.toBeInstanceOf(LearningPathNotStartedException);
	});

	it('remove deletes section progress', async () => {
		const repository = { remove: jest.fn().mockResolvedValue(true) };
		const handler = new RemoveSectionProgressHandler(repository as never);

		await handler.execute({ id: APP_TEST_IDS.sectionProgressId });
		expect(repository.remove).toHaveBeenCalledTimes(1);
	});

	it('remove throws when section progress does not exist', async () => {
		const repository = { remove: jest.fn().mockResolvedValue(false) };
		const handler = new RemoveSectionProgressHandler(repository as never);

		await expect(
			handler.execute({ id: APP_TEST_IDS.sectionProgressId }),
		).rejects.toBeInstanceOf(SectionProgressNotFoundException);
	});
});