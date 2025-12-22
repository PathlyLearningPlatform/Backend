import { SectionNotFoundException } from '@/domain/sections/exceptions';
import { UpdateSectionUseCase } from '../use-cases';
import { mockedUpdateCommand } from './mocks/commands.mock';
import { mockedUpdatedSection } from './mocks/sections.mock';
import { mockedSectionsRepository } from './mocks/sections.repository.mock';
import { mockedPathsRepository } from '@/app/paths/tests/mocks/paths.repository.mock';
import { PathNotFoundException } from '@/domain/paths/exceptions';
import { mockedPath } from '@/app/paths/tests/mocks/paths.mock';

describe('UpdateSectionUseCase', () => {
	let updateSectionUseCase: UpdateSectionUseCase;

	beforeEach(() => {
		updateSectionUseCase = new UpdateSectionUseCase(
			mockedSectionsRepository,
			mockedPathsRepository,
		);
	});

	describe('execute', () => {
		it('should throw a SectionNotFoundException', async () => {
			mockedPathsRepository.findOne.mockResolvedValueOnce(mockedPath);
			mockedSectionsRepository.update.mockResolvedValueOnce(null);

			const promise = updateSectionUseCase.execute({
				where: {
					id: 'unknown id',
				},
			});

			await expect(promise).rejects.toThrow(SectionNotFoundException);
		});

		it('should return a section', async () => {
			const expectedResult = mockedUpdatedSection;

			mockedPathsRepository.findOne.mockResolvedValueOnce(mockedPath);
			mockedSectionsRepository.update.mockResolvedValueOnce(
				mockedUpdatedSection,
			);

			const result = await updateSectionUseCase.execute(mockedUpdateCommand);

			expect(result).toEqual(expectedResult);
		});

		it('should throw PathNotFoundException', async () => {
			mockedSectionsRepository.findOne.mockResolvedValueOnce(null);

			const promise = updateSectionUseCase.execute(mockedUpdateCommand);

			await expect(promise).rejects.toThrow(PathNotFoundException);
		});
	});
});
