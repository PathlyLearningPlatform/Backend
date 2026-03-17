import { sectionProgressDtoToClient } from '@/infra/section-progress/helpers';
import { INFRA_TEST_IDS } from '../../common/test.utils';

describe('sectionProgressDtoToClient', () => {
	it('maps dto fields including optional completedAt', () => {
		const completedAt = new Date('2026-01-04T00:00:00.000Z');
		const result = sectionProgressDtoToClient({
			id: INFRA_TEST_IDS.sectionProgressId,
			sectionId: INFRA_TEST_IDS.sectionId,
			learningPathId: INFRA_TEST_IDS.learningPathId,
			userId: INFRA_TEST_IDS.userId,
			totalUnitCount: 4,
			completedUnitCount: 1,
			completedAt,
		} as never);

		expect(result.completedAt).toBe(completedAt.toISOString());
		expect(result.completedUnitCount).toBe(1);
		expect(result.totalUnitCount).toBe(4);
	});
});
