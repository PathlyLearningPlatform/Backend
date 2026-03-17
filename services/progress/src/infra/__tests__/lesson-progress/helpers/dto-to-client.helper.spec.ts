import { lessonProgressDtoToClient } from '@/infra/lesson-progress/helpers';
import { INFRA_TEST_IDS } from '../../common/test.utils';

describe('lessonProgressDtoToClient', () => {
	it('maps dto fields', () => {
		const completedAt = new Date('2026-01-02T00:00:00.000Z');
		const result = lessonProgressDtoToClient({
			id: INFRA_TEST_IDS.lessonProgressId,
			lessonId: INFRA_TEST_IDS.lessonId,
			unitId: INFRA_TEST_IDS.unitId,
			userId: INFRA_TEST_IDS.userId,
			completedAt,
			completedActivityCount: 2,
			totalActivityCount: 5,
		});

		expect(result.completedAt).toBe(completedAt.toISOString());
		expect(result.completedActivityCount).toBe(2);
		expect(result.totalActivityCount).toBe(5);
	});
});
