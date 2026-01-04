import {
	mockedLearningPath,
	mockedLearningPathsRepository,
	mockedSection,
	mockedSectionsRepository,
} from '@/app/common/mocks';
import { LearningPathNotFoundException } from '@/domain/learning-paths/exceptions';
import { CreateSectionUseCase } from '../create.use-case';

describe('CreateSectionUseCase', () => {
	let createSectionUseCase: CreateSectionUseCase;

	beforeEach(() => {
		createSectionUseCase = new CreateSectionUseCase(
			mockedSectionsRepository,
			mockedLearningPathsRepository,
		);
	});

	describe('execute', () => {
		it('should return a section', async () => {
			mockedLearningPathsRepository.findOne.mockResolvedValueOnce(
				mockedLearningPath,
			);

			mockedSectionsRepository.create.mockResolvedValueOnce(mockedSection);

			const result = await createSectionUseCase.execute({
				name: mockedSection.name,
				order: mockedSection.order,
				learningPathId: mockedSection.learningPathId,
			});

			expect(result).toEqual(mockedSection);
		});

		it('should throw LearningPathNotFoundException', async () => {
			mockedSectionsRepository.findOne.mockResolvedValueOnce(null);

			const promise = createSectionUseCase.execute({
				name: mockedSection.name,
				order: mockedSection.order,
				learningPathId: 'non-existent-learning-path-id',
			});

			await expect(promise).rejects.toThrow(LearningPathNotFoundException);
		});
	});
});
