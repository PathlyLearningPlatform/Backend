import { mockedSection, mockedSectionsRepository } from '@/app/common/mocks';
import { SectionNotFoundException } from '@/domain/sections/exceptions';
import { RemoveSectionUseCase } from '../remove.use-case';

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
			mockedSectionsRepository.remove.mockResolvedValueOnce(mockedSection);

			const result = await removeSectionUseCase.execute({
				where: { id: mockedSection.id },
			});

			expect(result).toEqual(mockedSection);
		});
	});
});
