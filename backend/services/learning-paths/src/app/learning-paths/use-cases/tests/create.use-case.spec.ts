import { CreateLearningPathUseCase } from '../create.use-case';
import { mockedLearningPath, mockedLearningPathsRepository } from '@/app/common/mocks';

describe('CreateLearningPathUseCase', () => {
	let createLearningPathUseCase: CreateLearningPathUseCase;

	beforeEach(() => {
		createLearningPathUseCase = new CreateLearningPathUseCase(mockedLearningPathsRepository);
	});

	describe('execute', () => {
		it('should return a learning path', async () => {
			mockedLearningPathsRepository.create.mockResolvedValueOnce(mockedLearningPath);

			const result = await createLearningPathUseCase.execute({
				name: mockedLearningPath.name,
			});

			expect(result).toEqual(mockedLearningPath);
		});
	});
});
