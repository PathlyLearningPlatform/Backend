import { OnActivityCompletedHandler } from '@/app/activity-progress/events';
import { ActivityCompletedEvent } from '@/domain/activity-progress';
import {
	APP_TEST_IDS,
	createEventBusMock,
	createProgressAggregateMock,
} from '../../common/test.utils';

describe('OnActivityCompletedHandler', () => {
	it('completes lesson progress and publishes events', async () => {
		const readRepository = {
			findForUser: jest.fn().mockResolvedValue({ id: APP_TEST_IDS.lessonProgressId }),
		};
		const aggregate = createProgressAggregateMock('completeActivity', [{ id: 1 }]);
		const repository = { load: jest.fn().mockResolvedValue(aggregate) };
		const eventBus = createEventBusMock();
		const handler = new OnActivityCompletedHandler(
			repository as never,
			readRepository as never,
			eventBus as never,
		);
		const event = new ActivityCompletedEvent(
			APP_TEST_IDS.activityId,
			APP_TEST_IDS.userId,
			APP_TEST_IDS.lessonId,
			new Date('2026-01-01T00:00:00.000Z'),
		);

		await handler.handle(event);

		expect(readRepository.findForUser).toHaveBeenCalledWith(
			APP_TEST_IDS.lessonId,
			APP_TEST_IDS.userId,
		);
		expect(repository.load).toHaveBeenCalledTimes(1);
		expect(aggregate.completeActivity).toHaveBeenCalledWith(event.occuredAt);
		expect(eventBus.publish).toHaveBeenCalledWith([{ id: 1 }]);
	});

	it('returns early when lesson progress dto is missing', async () => {
		const readRepository = { findForUser: jest.fn().mockResolvedValue(null) };
		const repository = { load: jest.fn() };
		const eventBus = createEventBusMock();
		const handler = new OnActivityCompletedHandler(
			repository as never,
			readRepository as never,
			eventBus as never,
		);

		await handler.handle(
			new ActivityCompletedEvent(
				APP_TEST_IDS.activityId,
				APP_TEST_IDS.userId,
				APP_TEST_IDS.lessonId,
				new Date(),
			),
		);

		expect(repository.load).not.toHaveBeenCalled();
		expect(eventBus.publish).not.toHaveBeenCalled();
	});

	it('returns early when aggregate is missing', async () => {
		const readRepository = {
			findForUser: jest.fn().mockResolvedValue({ id: APP_TEST_IDS.lessonProgressId }),
		};
		const repository = { load: jest.fn().mockResolvedValue(null) };
		const eventBus = createEventBusMock();
		const handler = new OnActivityCompletedHandler(
			repository as never,
			readRepository as never,
			eventBus as never,
		);

		await handler.handle(
			new ActivityCompletedEvent(
				APP_TEST_IDS.activityId,
				APP_TEST_IDS.userId,
				APP_TEST_IDS.lessonId,
				new Date(),
			),
		);

		expect(eventBus.publish).not.toHaveBeenCalled();
	});
});