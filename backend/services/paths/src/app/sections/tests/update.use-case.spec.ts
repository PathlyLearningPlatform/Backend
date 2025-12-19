import { SectionNotFoundException } from '@/domain/sections/exceptions';
import { UpdateSectionUseCase } from '../use-cases';
import { mockedUpdateCommand } from './mocks/commands.mock';
import { mockedSection, mockedUpdatedSection } from './mocks/sections.mock';
import { mockedSectionsRepository } from './mocks/sections.repository.mock';

describe('UpdateSectionUseCase', () => {
	let updateSectionUseCase: UpdateSectionUseCase;

	beforeEach(() => {
		updateSectionUseCase = new UpdateSectionUseCase(mockedSectionsRepository);
	});

	describe('execute', () => {
		it('should throw a SectionNotFoundException', async () => {
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

			mockedSectionsRepository.update.mockResolvedValueOnce(
				mockedUpdatedSection,
			);

			const result = await updateSectionUseCase.execute(mockedUpdateCommand);

			expect(result).toEqual(expectedResult);
		});
	});
});
