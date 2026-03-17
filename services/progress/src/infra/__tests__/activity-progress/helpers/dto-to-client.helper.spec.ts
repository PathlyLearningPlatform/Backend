import { activityProgressDtoToClient } from '@/infra/activity-progress/helpers';
import { INFRA_TEST_IDS } from '../../common/test.utils';

describe('activityProgressDtoToClient', () => {
	it('maps dto with completedAt date', () => {
		const completedAt = new Date('2026-01-01T00:00:00.000Z');
		const result = activityProgressDtoToClient({
			id: INFRA_TEST_IDS.activityProgressId,
			activityId: INFRA_TEST_IDS.activityId,
			lessonId: INFRA_TEST_IDS.lessonId,
			userId: INFRA_TEST_IDS.userId,
			completedAt,
		});

		expect(result).toEqual({
			id: INFRA_TEST_IDS.activityProgressId,
			activityId: INFRA_TEST_IDS.activityId,
			lessonId: INFRA_TEST_IDS.lessonId,
			userId: INFRA_TEST_IDS.userId,
			completedAt: completedAt.toISOString(),
		});
	});

	it('maps null completedAt as empty string', () => {
		const result = activityProgressDtoToClient({
			id: INFRA_TEST_IDS.activityProgressId,
			activityId: INFRA_TEST_IDS.activityId,
			lessonId: INFRA_TEST_IDS.lessonId,
			userId: INFRA_TEST_IDS.userId,
			completedAt: null,
		});

		expect(result.completedAt).toBe('');
	});
});
