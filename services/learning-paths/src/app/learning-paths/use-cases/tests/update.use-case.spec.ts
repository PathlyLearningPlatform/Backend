import {
	mockedLearningPath,
	mockedLearningPathsRepository,
} from '@/app/common/mocks';
import { LearningPathNotFoundException } from '@/domain/learning-paths/exceptions';
import { UpdateLearningPathUseCase } from '../update.use-case';

describe('UpdateLearningPathUseCase', () => {
	let updateLearningPathUseCase: UpdateLearningPathUseCase;

	beforeEach(() => {
		updateLearningPathUseCase = new UpdateLearningPathUseCase(
			mockedLearningPathsRepository,
		);
	});

	describe('execute', () => {
		it('should throw a LearningPathNotFoundException', async () => {
			mockedLearningPathsRepository.update.mockResolvedValueOnce(null);

			const promise = updateLearningPathUseCase.execute({
				where: {
					id: 'unknown id',
				},
			});

			await expect(promise).rejects.toThrow(LearningPathNotFoundException);
		});

		it('should return a learning path', async () => {
			mockedLearningPathsRepository.update.mockResolvedValueOnce(
				mockedLearningPath,
			);

			const result = await updateLearningPathUseCase.execute({
				where: { id: mockedLearningPath.id },
			});

			expect(result).toEqual(mockedLearningPath);
		});
	});
});
