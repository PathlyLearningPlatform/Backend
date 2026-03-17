import { UserId, UUID } from '../../common';
import { LearningPathProgress } from '../../learning-path-progress/learning-path-progress.aggregate';
import { LearningPathCompletedEvent } from '../../learning-path-progress/events';
import {
	LearningPathId,
	LearningPathProgressId,
} from '../../learning-path-progress/value-objects';
import { TEST_NOW, TEST_UUIDS } from '../common/domain-test.utils';

describe('LearningPathProgress', () => {
	it('creates with zero completed sections', () => {
		const aggregate = LearningPathProgress.create(
			LearningPathProgressId.create(
				UUID.create(TEST_UUIDS.learningPathProgressId),
			),
			{
				learningPathId: LearningPathId.create(
					UUID.create(TEST_UUIDS.learningPathId),
				),
				userId: UserId.create(UUID.create(TEST_UUIDS.userId)),
				totalSectionCount: 3,
			},
		);

		expect(aggregate.completedSectionCount).toBe(0);
		expect(aggregate.totalSectionCount).toBe(3);
		expect(aggregate.completedAt).toBeNull();
	});

	it('hydrates from data source', () => {
		const completedAt = new Date('2026-01-01T00:00:00.000Z');

		const aggregate = LearningPathProgress.fromDataSource({
			id: TEST_UUIDS.learningPathProgressId,
			learningPathId: TEST_UUIDS.learningPathId,
			userId: TEST_UUIDS.userId,
			completedAt,
			completedSectionCount: 4,
			totalSectionCount: 4,
		});

		expect(aggregate.completedSectionCount).toBe(4);
		expect(aggregate.totalSectionCount).toBe(4);
		expect(aggregate.completedAt).toBe(completedAt);
	});

	it('increments progress and emits event only on last section', () => {
		const aggregate = LearningPathProgress.create(
			LearningPathProgressId.create(
				UUID.create(TEST_UUIDS.learningPathProgressId),
			),
			{
				learningPathId: LearningPathId.create(
					UUID.create(TEST_UUIDS.learningPathId),
				),
				userId: UserId.create(UUID.create(TEST_UUIDS.userId)),
				totalSectionCount: 2,
			},
		);

		aggregate.completeSection(TEST_NOW);
		expect(aggregate.completedSectionCount).toBe(1);
		expect(aggregate.completedAt).toBeNull();
		expect(aggregate.events).toHaveLength(0);

		aggregate.completeSection(TEST_NOW);
		expect(aggregate.completedSectionCount).toBe(2);
		expect(aggregate.completedAt).toBe(TEST_NOW);

		const events = aggregate.pullEvents();
		expect(events).toHaveLength(1);
		expect(events[0]).toBeInstanceOf(LearningPathCompletedEvent);
		expect(events[0]).toMatchObject({
			learningPathId: TEST_UUIDS.learningPathId,
			userId: TEST_UUIDS.userId,
			occuredAt: TEST_NOW,
		});
	});

	it('does not increment when already completed', () => {
		const completedAt = new Date('2026-01-10T00:00:00.000Z');
		const aggregate = LearningPathProgress.fromDataSource({
			id: TEST_UUIDS.learningPathProgressId,
			learningPathId: TEST_UUIDS.learningPathId,
			userId: TEST_UUIDS.userId,
			completedAt,
			completedSectionCount: 2,
			totalSectionCount: 2,
		});

		aggregate.completeSection(TEST_NOW);

		expect(aggregate.completedSectionCount).toBe(2);
		expect(aggregate.completedAt).toBe(completedAt);
		expect(aggregate.pullEvents()).toHaveLength(0);
	});
});