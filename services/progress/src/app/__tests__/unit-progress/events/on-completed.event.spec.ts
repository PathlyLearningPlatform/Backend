import { OnUnitCompletedHandler } from '@/app/unit-progress/events';
import { UnitCompletedEvent } from '@/domain/unit-progress';
import {
	APP_TEST_IDS,
	createEventBusMock,
	createProgressAggregateMock,
} from '../../common/test.utils';

describe('OnUnitCompletedHandler', () => {
	it('completes section progress and publishes events', async () => {
		const readRepository = {
			findForUser: jest.fn().mockResolvedValue({ id: APP_TEST_IDS.sectionProgressId }),
		};
		const aggregate = createProgressAggregateMock('completeUnit', [{ id: 1 }]);
		const repository = { load: jest.fn().mockResolvedValue(aggregate) };
		const eventBus = createEventBusMock();
		const handler = new OnUnitCompletedHandler(
			repository as never,
			readRepository as never,
			eventBus as never,
		);
		const event = new UnitCompletedEvent(
			APP_TEST_IDS.unitId,
			APP_TEST_IDS.sectionId,
			APP_TEST_IDS.userId,
			new Date('2026-01-01T00:00:00.000Z'),
		);

		await handler.handle(event);

		expect(readRepository.findForUser).toHaveBeenCalledWith(
			APP_TEST_IDS.sectionId,
			APP_TEST_IDS.userId,
		);
		expect(aggregate.completeUnit).toHaveBeenCalledWith(event.occuredAt);
		expect(eventBus.publish).toHaveBeenCalledWith([{ id: 1 }]);
	});

	it('returns early when dto is missing', async () => {
		const readRepository = { findForUser: jest.fn().mockResolvedValue(null) };
		const repository = { load: jest.fn() };
		const eventBus = createEventBusMock();
		const handler = new OnUnitCompletedHandler(
			repository as never,
			readRepository as never,
			eventBus as never,
		);

		await handler.handle(
			new UnitCompletedEvent(
				APP_TEST_IDS.unitId,
				APP_TEST_IDS.sectionId,
				APP_TEST_IDS.userId,
				new Date(),
			),
		);

		expect(repository.load).not.toHaveBeenCalled();
		expect(eventBus.publish).not.toHaveBeenCalled();
	});

	it('returns early when aggregate is missing', async () => {
		const readRepository = {
			findForUser: jest.fn().mockResolvedValue({ id: APP_TEST_IDS.sectionProgressId }),
		};
		const repository = { load: jest.fn().mockResolvedValue(null) };
		const eventBus = createEventBusMock();
		const handler = new OnUnitCompletedHandler(
			repository as never,
			readRepository as never,
			eventBus as never,
		);

		await handler.handle(
			new UnitCompletedEvent(
				APP_TEST_IDS.unitId,
				APP_TEST_IDS.sectionId,
				APP_TEST_IDS.userId,
				new Date(),
			),
		);

		expect(eventBus.publish).not.toHaveBeenCalled();
	});
});