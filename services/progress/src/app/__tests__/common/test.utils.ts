export const APP_TEST_IDS = {
	userId: '11111111-1111-4111-8111-111111111111',
	activityId: '22222222-2222-4222-8222-222222222222',
	activityProgressId: '33333333-3333-4333-8333-333333333333',
	lessonId: '44444444-4444-4444-8444-444444444444',
	lessonProgressId: '55555555-5555-4555-8555-555555555555',
	unitId: '66666666-6666-4666-8666-666666666666',
	unitProgressId: '77777777-7777-4777-8777-777777777777',
	sectionId: '88888888-8888-4888-8888-888888888888',
	sectionProgressId: '99999999-9999-4999-8999-999999999999',
	learningPathId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
	learningPathProgressId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
} as const;

export const createEventBusMock = () => ({
	publish: jest.fn().mockResolvedValue(undefined),
});

export const createReadRepositoryMock = () => ({
	findById: jest.fn(),
	findForUser: jest.fn(),
	list: jest.fn(),
});

export const createProgressAggregateMock = <TMethod extends string>(
	methodName: TMethod,
	events: unknown[] = [],
) => {
	const method = jest.fn();
	return {
		[methodName]: method,
		pullEvents: jest.fn().mockReturnValue(events),
	};
};