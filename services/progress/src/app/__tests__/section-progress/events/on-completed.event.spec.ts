import { OnSectionCompletedHandler } from '@/app/section-progress/events';
import { SectionCompletedEvent } from '@/domain/section-progress';
import {
	APP_TEST_IDS,
	createEventBusMock,
	createProgressAggregateMock,
} from '../../common/test.utils';

describe('OnSectionCompletedHandler', () => {
	it('completes learning-path progress and publishes events', async () => {
		const readRepository = {
			findForUser: jest
				.fn()
				.mockResolvedValue({ id: APP_TEST_IDS.learningPathProgressId }),
		};
		const aggregate = createProgressAggregateMock('completeSection', [{ id: 1 }]);
		const repository = { load: jest.fn().mockResolvedValue(aggregate) };
		const eventBus = createEventBusMock();
		const handler = new OnSectionCompletedHandler(
			repository as never,
			readRepository as never,
			eventBus as never,
		);
		const event = new SectionCompletedEvent(
			APP_TEST_IDS.sectionId,
			APP_TEST_IDS.learningPathId,
			APP_TEST_IDS.userId,
			new Date('2026-01-01T00:00:00.000Z'),
		);

		await handler.handle(event);

		expect(readRepository.findForUser).toHaveBeenCalledWith(
			APP_TEST_IDS.learningPathId,
			APP_TEST_IDS.userId,
		);
		expect(aggregate.completeSection).toHaveBeenCalledWith(event.occuredAt);
		expect(eventBus.publish).toHaveBeenCalledWith([{ id: 1 }]);
	});

	it('returns early when dto is missing', async () => {
		const readRepository = { findForUser: jest.fn().mockResolvedValue(null) };
		const repository = { load: jest.fn() };
		const eventBus = createEventBusMock();
		const handler = new OnSectionCompletedHandler(
			repository as never,
			readRepository as never,
			eventBus as never,
		);

		await handler.handle(
			new SectionCompletedEvent(
				APP_TEST_IDS.sectionId,
				APP_TEST_IDS.learningPathId,
				APP_TEST_IDS.userId,
				new Date(),
			),
		);

		expect(repository.load).not.toHaveBeenCalled();
		expect(eventBus.publish).not.toHaveBeenCalled();
	});

	it('returns early when aggregate is missing', async () => {
		const readRepository = {
			findForUser: jest
				.fn()
				.mockResolvedValue({ id: APP_TEST_IDS.learningPathProgressId }),
		};
		const repository = { load: jest.fn().mockResolvedValue(null) };
		const eventBus = createEventBusMock();
		const handler = new OnSectionCompletedHandler(
			repository as never,
			readRepository as never,
			eventBus as never,
		);

		await handler.handle(
			new SectionCompletedEvent(
				APP_TEST_IDS.sectionId,
				APP_TEST_IDS.learningPathId,
				APP_TEST_IDS.userId,
				new Date(),
			),
		);

		expect(eventBus.publish).not.toHaveBeenCalled();
	});
});