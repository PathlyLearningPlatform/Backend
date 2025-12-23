import { CreateSectionUseCase } from '../create.use-case';
import { PathNotFoundException } from '@/domain/paths/exceptions';
import {
	mockedPath,
	mockedSection,
	mockedPathsRepository,
	mockedSectionsRepository,
} from '@/app/common/mocks';

describe('CreateSectionUseCase', () => {
	let createSectionUseCase: CreateSectionUseCase;

	beforeEach(() => {
		createSectionUseCase = new CreateSectionUseCase(
			mockedSectionsRepository,
			mockedPathsRepository,
		);
	});

	describe('execute', () => {
		it('should return a section', async () => {
			mockedPathsRepository.findOne.mockResolvedValueOnce(mockedPath);

			mockedSectionsRepository.create.mockResolvedValueOnce(mockedSection);

			const result = await createSectionUseCase.execute({
				name: mockedSection.name,
				order: mockedSection.order,
				pathId: mockedSection.pathId,
			});

			expect(result).toEqual(mockedSection);
		});

		it('should throw PathNotFoundException', async () => {
			mockedSectionsRepository.findOne.mockResolvedValueOnce(null);

			const promise = createSectionUseCase.execute({
				name: mockedSection.name,
				order: mockedSection.order,
				pathId: 'non-existent-path-id',
			});

			await expect(promise).rejects.toThrow(PathNotFoundException);
		});
	});
});
