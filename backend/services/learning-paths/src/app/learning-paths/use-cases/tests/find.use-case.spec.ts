import type { LearningPath } from '@/domain/learning-paths/entities';
import { FindLearningPathsUseCase } from '../find.use-case';
import { mockedLearningPath, mockedLearningPathsRepository } from '@/app/common/mocks';

describe('FindPathsUseCase', () => {
	let findLearningPathsUseCase: FindLearningPathsUseCase;

	beforeEach(() => {
		findLearningPathsUseCase = new FindLearningPathsUseCase(mockedLearningPathsRepository);
	});

	describe('execute', () => {
		it('should return an array of learning paths', async () => {
			const expectedResult: LearningPath[] = [mockedLearningPath];

			mockedLearningPathsRepository.find.mockResolvedValueOnce([mockedLearningPath]);

			const result = await findLearningPathsUseCase.execute({});

			expect(result).toEqual(expectedResult);
		});
	});
});
