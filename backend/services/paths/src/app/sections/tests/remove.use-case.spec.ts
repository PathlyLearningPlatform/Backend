import { SectionNotFoundException } from '@/domain/sections/exceptions';
import { RemoveSectionUseCase } from '../use-cases';
import { mockedRemoveCommand } from './mocks/commands.mock';
import { mockedSection } from './mocks/sections.mock';
import { mockedSectionsRepository } from './mocks/sections.repository.mock';

describe('RemoveSectionUseCase', () => {
	let removeSectionUseCase: RemoveSectionUseCase;

	beforeEach(() => {
		removeSectionUseCase = new RemoveSectionUseCase(mockedSectionsRepository);
	});

	describe('execute', () => {
		it('should throw a SectionNotFoundException', async () => {
			mockedSectionsRepository.remove.mockResolvedValueOnce(null);

			const promise = removeSectionUseCase.execute({
				where: {
					id: 'unknown id',
				},
			});

			await expect(promise).rejects.toThrow(SectionNotFoundException);
		});

		it('should return a section', async () => {
			const expectedResult = mockedSection;

			mockedSectionsRepository.remove.mockResolvedValueOnce(mockedSection);

			const result = await removeSectionUseCase.execute(mockedRemoveCommand);

			expect(result).toEqual(expectedResult);
		});
	});
});
