import { InMemoryEventBus } from '@/infra/common';

describe('InMemoryEventBus', () => {
	it('emits all events through EventEmitter2', async () => {
		const eventEmitter = { emit: jest.fn() };
		const bus = new InMemoryEventBus(eventEmitter as never);

		await bus.publish([
			{ eventName: 'event.one', payload: 1 },
			{ eventName: 'event.two', payload: 2 },
		] as never);

		expect(eventEmitter.emit).toHaveBeenNthCalledWith(1, 'event.one', {
			eventName: 'event.one',
			payload: 1,
		});
		expect(eventEmitter.emit).toHaveBeenNthCalledWith(2, 'event.two', {
			eventName: 'event.two',
			payload: 2,
		});
	});
});
