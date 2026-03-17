import { UUID } from '../../common';

export const TEST_UUIDS = {
	userId: '11111111-1111-4111-8111-111111111111',
	activityProgressId: '22222222-2222-4222-8222-222222222222',
	activityId: '33333333-3333-4333-8333-333333333333',
	lessonProgressId: '44444444-4444-4444-8444-444444444444',
	lessonId: '55555555-5555-4555-8555-555555555555',
	unitProgressId: '66666666-6666-4666-8666-666666666666',
	unitId: '77777777-7777-4777-8777-777777777777',
	sectionProgressId: '88888888-8888-4888-8888-888888888888',
	sectionId: '99999999-9999-4999-8999-999999999999',
	learningPathProgressId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
	learningPathId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
} as const;

export const createUuid = (value: string): UUID => UUID.create(value);

export const TEST_NOW = new Date('2026-01-15T12:00:00.000Z');