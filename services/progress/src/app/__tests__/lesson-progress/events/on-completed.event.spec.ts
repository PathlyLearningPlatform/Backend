import { OnLessonCompletedHandler } from '@/app/lesson-progress/events';
import { LessonCompletedEvent } from '@/domain/lesson-progress';
import {
	APP_TEST_IDS,
	createEventBusMock,
	createProgressAggregateMock,
} from '../../common/test.utils';

describe('OnLessonCompletedHandler', () => {
	it('completes unit progress and publishes events', async () => {
		const readRepository = {
			findForUser: jest.fn().mockResolvedValue({ id: APP_TEST_IDS.unitProgressId }),
		};
		const aggregate = createProgressAggregateMock('completeLesson', [{ id: 1 }]);
		const repository = { load: jest.fn().mockResolvedValue(aggregate) };
		const eventBus = createEventBusMock();
		const handler = new OnLessonCompletedHandler(
			repository as never,
			readRepository as never,
			eventBus as never,
		);
		const event = new LessonCompletedEvent(
			APP_TEST_IDS.lessonId,
			APP_TEST_IDS.unitId,
			APP_TEST_IDS.userId,
			new Date('2026-01-01T00:00:00.000Z'),
		);

		await handler.handle(event);

		expect(readRepository.findForUser).toHaveBeenCalledWith(
			APP_TEST_IDS.unitId,
			APP_TEST_IDS.userId,
		);
		expect(aggregate.completeLesson).toHaveBeenCalledWith(event.occuredAt);
		expect(eventBus.publish).toHaveBeenCalledWith([{ id: 1 }]);
	});

	it('returns early when dto is missing', async () => {
		const readRepository = { findForUser: jest.fn().mockResolvedValue(null) };
		const repository = { load: jest.fn() };
		const eventBus = createEventBusMock();
		const handler = new OnLessonCompletedHandler(
			repository as never,
			readRepository as never,
			eventBus as never,
		);

		await handler.handle(
			new LessonCompletedEvent(
				APP_TEST_IDS.lessonId,
				APP_TEST_IDS.unitId,
				APP_TEST_IDS.userId,
				new Date(),
			),
		);

		expect(repository.load).not.toHaveBeenCalled();
		expect(eventBus.publish).not.toHaveBeenCalled();
	});

	it('returns early when aggregate is missing', async () => {
		const readRepository = {
			findForUser: jest.fn().mockResolvedValue({ id: APP_TEST_IDS.unitProgressId }),
		};
		const repository = { load: jest.fn().mockResolvedValue(null) };
		const eventBus = createEventBusMock();
		const handler = new OnLessonCompletedHandler(
			repository as never,
			readRepository as never,
			eventBus as never,
		);

		await handler.handle(
			new LessonCompletedEvent(
				APP_TEST_IDS.lessonId,
				APP_TEST_IDS.unitId,
				APP_TEST_IDS.userId,
				new Date(),
			),
		);

		expect(eventBus.publish).not.toHaveBeenCalled();
	});
});