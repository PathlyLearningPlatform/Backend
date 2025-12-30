import { InvalidReferenceException } from '@pathly-backend/common/index.js';
import {
	mockedLearningPath,
	mockedLearningPathsRepository,
} from '@/app/common/mocks';
import {
	LearningPathCannotBeRemovedException,
	LearningPathNotFoundException,
} from '@/domain/learning-paths/exceptions';
import { RemoveLearningPathUseCase } from '../remove.use-case';

describe('RemoveLearningPathUseCase', () => {
	let removeLearningPathUseCase: RemoveLearningPathUseCase;

	beforeEach(() => {
		removeLearningPathUseCase = new RemoveLearningPathUseCase(
			mockedLearningPathsRepository,
		);
	});

	describe('execute', () => {
		it('should throw LearningPathNotFoundException', async () => {
			mockedLearningPathsRepository.remove.mockResolvedValueOnce(null);

			const promise = removeLearningPathUseCase.execute({
				where: {
					id: 'unknown id',
				},
			});

			await expect(promise).rejects.toThrow(LearningPathNotFoundException);
		});

		it('should throw LearningPathCannotBeRemovedException', async () => {
			mockedLearningPathsRepository.remove.mockRejectedValueOnce(
				new InvalidReferenceException(''),
			);

			const promise = removeLearningPathUseCase.execute({
				where: {
					id: mockedLearningPath.id,
				},
			});

			await expect(promise).rejects.toThrow(
				LearningPathCannotBeRemovedException,
			);
		});

		it('should return a learning path', async () => {
			mockedLearningPathsRepository.remove.mockResolvedValueOnce(
				mockedLearningPath,
			);

			const result = await removeLearningPathUseCase.execute({
				where: { id: mockedLearningPath.id },
			});

			expect(result).toEqual(mockedLearningPath);
		});
	});
});
