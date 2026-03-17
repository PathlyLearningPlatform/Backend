import { learningPathProgressDtoToClient } from '@/infra/learning-path-progress/helpers';
import { INFRA_TEST_IDS } from '../../common/test.utils';

describe('learningPathProgressDtoToClient', () => {
	it('maps dto fields', () => {
		const completedAt = new Date('2026-01-05T00:00:00.000Z');
		const result = learningPathProgressDtoToClient({
			id: INFRA_TEST_IDS.learningPathProgressId,
			learningPathId: INFRA_TEST_IDS.learningPathId,
			userId: INFRA_TEST_IDS.userId,
			completedAt,
			completedSectionCount: 2,
			totalSectionCount: 8,
		});

		expect(result.completedAt).toBe(completedAt.toISOString());
		expect(result.completedSectionCount).toBe(2);
		expect(result.totalSectionCount).toBe(8);
	});
});
