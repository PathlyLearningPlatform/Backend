import { LearningPathNotFoundException } from '@/domain/learning-paths/exceptions';
import { FindOneLearningPathUseCase } from '../find-one.use-case';
import { mockedLearningPath, mockedLearningPathsRepository } from '@/app/common/mocks';

describe('FindOneLearningPathUseCase', () => {
	let findOneLearningPathUseCase: FindOneLearningPathUseCase;

	beforeEach(() => {
		findOneLearningPathUseCase = new FindOneLearningPathUseCase(mockedLearningPathsRepository);
	});

	describe('execute', () => {
		it('should throw a LearningPathNotFoundException', async () => {
			mockedLearningPathsRepository.findOne.mockResolvedValueOnce(null);

			const promise = findOneLearningPathUseCase.execute({
				where: {
					id: 'unknown id',
				},
			});

			await expect(promise).rejects.toThrow(LearningPathNotFoundException);
		});

		it('should return a learning path', async () => {
			mockedLearningPathsRepository.findOne.mockResolvedValueOnce(mockedLearningPath);

			const result = await findOneLearningPathUseCase.execute({
				where: { id: mockedLearningPath.id },
			});

			expect(result).toEqual(mockedLearningPath);
		});
	});
});
