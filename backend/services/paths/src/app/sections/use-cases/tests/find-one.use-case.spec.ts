import { SectionNotFoundException } from '@/domain/sections/exceptions';
import { FindOneSectionUseCase } from '../find-one.use-case';
import { mockedSection, mockedSectionsRepository } from '@/app/common/mocks';

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
			mockedSectionsRepository.findOne.mockResolvedValueOnce(mockedSection);

			const result = await findOneSectionUseCase.execute({
				where: { id: mockedSection.id },
			});

			expect(result).toEqual(mockedSection);
		});
	});
});
