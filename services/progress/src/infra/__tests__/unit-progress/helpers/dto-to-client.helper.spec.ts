import { unitProgressDtoToClient } from '@/infra/unit-progress/helpers';
import { INFRA_TEST_IDS } from '../../common/test.utils';

describe('unitProgressDtoToClient', () => {
	it('maps dto fields', () => {
		const completedAt = new Date('2026-01-03T00:00:00.000Z');
		const result = unitProgressDtoToClient({
			id: INFRA_TEST_IDS.unitProgressId,
			unitId: INFRA_TEST_IDS.unitId,
			sectionId: INFRA_TEST_IDS.sectionId,
			userId: INFRA_TEST_IDS.userId,
			completedAt,
			completedLessonCount: 3,
			totalLessonCount: 7,
		});

		expect(result.completedAt).toBe(completedAt.toISOString());
		expect(result.completedLessonCount).toBe(3);
		expect(result.totalLessonCount).toBe(7);
	});
});
