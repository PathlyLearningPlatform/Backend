import { UserId, UUID } from '../../common';
import { LessonId } from '../../lesson-progress/value-objects';
import { ActivityProgress } from '../../activity-progress/activity-progress.aggregate';
import { ActivityCompletedEvent } from '../../activity-progress/events';
import { ActivityId, ActivityProgressId } from '../../activity-progress/value-objects';
import { TEST_NOW, TEST_UUIDS } from '../common/domain-test.utils';

describe('ActivityProgress', () => {
	it('creates new progress with default completion state', () => {
		const aggregate = ActivityProgress.create(
			ActivityProgressId.create(UUID.create(TEST_UUIDS.activityProgressId)),
			{
				activityId: ActivityId.create(UUID.create(TEST_UUIDS.activityId)),
				lessonId: LessonId.create(UUID.create(TEST_UUIDS.lessonId)),
				userId: UserId.create(UUID.create(TEST_UUIDS.userId)),
			},
		);

		expect(aggregate.id.toString()).toBe(TEST_UUIDS.activityProgressId);
		expect(aggregate.activityId.toString()).toBe(TEST_UUIDS.activityId);
		expect(aggregate.lessonId.toString()).toBe(TEST_UUIDS.lessonId);
		expect(aggregate.userId.toString()).toBe(TEST_UUIDS.userId);
		expect(aggregate.completedAt).toBeNull();
		expect(aggregate.events).toHaveLength(0);
	});

	it('hydrates aggregate from data source', () => {
		const completedAt = new Date('2026-01-01T00:00:00.000Z');

		const aggregate = ActivityProgress.fromDataSource({
			id: TEST_UUIDS.activityProgressId,
			activityId: TEST_UUIDS.activityId,
			lessonId: TEST_UUIDS.lessonId,
			userId: TEST_UUIDS.userId,
			completedAt,
		});

		expect(aggregate.id.toString()).toBe(TEST_UUIDS.activityProgressId);
		expect(aggregate.completedAt).toBe(completedAt);
	});

	it('completes and emits ActivityCompletedEvent once', () => {
		const aggregate = ActivityProgress.create(
			ActivityProgressId.create(UUID.create(TEST_UUIDS.activityProgressId)),
			{
				activityId: ActivityId.create(UUID.create(TEST_UUIDS.activityId)),
				lessonId: LessonId.create(UUID.create(TEST_UUIDS.lessonId)),
				userId: UserId.create(UUID.create(TEST_UUIDS.userId)),
			},
		);

		aggregate.complete(TEST_NOW);

		expect(aggregate.completedAt).toBe(TEST_NOW);
		const events = aggregate.pullEvents();
		expect(events).toHaveLength(1);
		expect(events[0]).toBeInstanceOf(ActivityCompletedEvent);
		expect(events[0]).toMatchObject({
			activityId: TEST_UUIDS.activityId,
			lessonId: TEST_UUIDS.lessonId,
			userId: TEST_UUIDS.userId,
			occuredAt: TEST_NOW,
		});
		expect(aggregate.events).toHaveLength(0);
	});

	it('does nothing when already completed', () => {
		const initialCompletedAt = new Date('2026-01-05T00:00:00.000Z');
		const aggregate = ActivityProgress.fromDataSource({
			id: TEST_UUIDS.activityProgressId,
			activityId: TEST_UUIDS.activityId,
			lessonId: TEST_UUIDS.lessonId,
			userId: TEST_UUIDS.userId,
			completedAt: initialCompletedAt,
		});

		aggregate.complete(TEST_NOW);

		expect(aggregate.completedAt).toBe(initialCompletedAt);
		expect(aggregate.pullEvents()).toHaveLength(0);
	});
});