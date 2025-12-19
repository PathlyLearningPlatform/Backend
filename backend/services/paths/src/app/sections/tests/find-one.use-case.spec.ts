import { SectionNotFoundException } from '@/domain/sections/exceptions';
import { FindOneSectionUseCase } from '../use-cases';
import { mockedFindOneCommand } from './mocks/commands.mock';
import { mockedSection } from './mocks/sections.mock';
import { mockedSectionsRepository } from './mocks/sections.repository.mock';

describe('FindOneSectionUseCase', () => {
	let findOneSectionUseCase: FindOneSectionUseCase;

	beforeEach(() => {
		findOneSectionUseCase = new FindOneSectionUseCase(mockedSectionsRepository);
	});

	describe('execute', () => {
		it('should throw a SectionNotFoundException', async () => {
			mockedSectionsRepository.findOne.mockResolvedValueOnce(null);

			const promise = findOneSectionUseCase.execute({
				where: {
					id: 'unknown id',
				},
			});

			await expect(promise).rejects.toThrow(SectionNotFoundException);
		});

		it('should return a section', async () => {
			const expectedResult = mockedSection;

			mockedSectionsRepository.findOne.mockResolvedValueOnce(mockedSection);

			const result = await findOneSectionUseCase.execute(mockedFindOneCommand);

			expect(result).toEqual(expectedResult);
		});
	});
});
