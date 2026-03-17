import { UnitNotFoundException } from '@/app/common';
import {
	RemoveUnitProgressHandler,
	StartUnitHandler,
} from '@/app/unit-progress/commands';
import {
	SectionNotStartedException,
	UnitProgressNotFoundException,
} from '@/app/unit-progress/exceptions';
import { APP_TEST_IDS, createEventBusMock } from '../../common/test.utils';

describe('unit-progress commands', () => {
	it('start creates progress and publishes events', async () => {
		const repository = { save: jest.fn() };
		const sectionProgressReadRepository = {
			findForUser: jest.fn().mockResolvedValue({ id: APP_TEST_IDS.sectionProgressId }),
		};
		const learningPathsService = {
			findUnitById: jest.fn().mockResolvedValue({
				id: APP_TEST_IDS.unitId,
				sectionId: APP_TEST_IDS.sectionId,
				lessonCount: 6,
			}),
		};
		const eventBus = createEventBusMock();
		const handler = new StartUnitHandler(
			repository as never,
			sectionProgressReadRepository as never,
			learningPathsService as never,
			eventBus as never,
		);

		const result = await handler.execute({
			unitId: APP_TEST_IDS.unitId,
			userId: APP_TEST_IDS.userId,
		});

		expect(repository.save).toHaveBeenCalledTimes(1);
		expect(eventBus.publish).toHaveBeenCalledTimes(1);
		expect(result.unitId).toBe(APP_TEST_IDS.unitId);
		expect(result.sectionId).toBe(APP_TEST_IDS.sectionId);
		expect(result.totalLessonCount).toBe(6);
		expect(result.completedLessonCount).toBe(0);
	});

	it('start throws when unit does not exist', async () => {
		const handler = new StartUnitHandler(
			{ save: jest.fn() } as never,
			{ findForUser: jest.fn() } as never,
			{ findUnitById: jest.fn().mockResolvedValue(null) } as never,
			createEventBusMock() as never,
		);

		await expect(
			handler.execute({ unitId: APP_TEST_IDS.unitId, userId: APP_TEST_IDS.userId }),
		).rejects.toBeInstanceOf(UnitNotFoundException);
	});

	it('start throws when section progress was not started', async () => {
		const handler = new StartUnitHandler(
			{ save: jest.fn() } as never,
			{ findForUser: jest.fn().mockResolvedValue(null) } as never,
			{
				findUnitById: jest.fn().mockResolvedValue({
					id: APP_TEST_IDS.unitId,
					sectionId: APP_TEST_IDS.sectionId,
					lessonCount: 2,
				}),
			} as never,
			createEventBusMock() as never,
		);

		await expect(
			handler.execute({ unitId: APP_TEST_IDS.unitId, userId: APP_TEST_IDS.userId }),
		).rejects.toBeInstanceOf(SectionNotStartedException);
	});

	it('remove deletes unit progress', async () => {
		const repository = { remove: jest.fn().mockResolvedValue(true) };
		const handler = new RemoveUnitProgressHandler(repository as never);

		await handler.execute({ id: APP_TEST_IDS.unitProgressId });
		expect(repository.remove).toHaveBeenCalledTimes(1);
	});

	it('remove throws when unit progress does not exist', async () => {
		const repository = { remove: jest.fn().mockResolvedValue(false) };
		const handler = new RemoveUnitProgressHandler(repository as never);

		await expect(
			handler.execute({ id: APP_TEST_IDS.unitProgressId }),
		).rejects.toBeInstanceOf(UnitProgressNotFoundException);
	});
});