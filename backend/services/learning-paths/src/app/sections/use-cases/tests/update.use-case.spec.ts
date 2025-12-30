import { mockedSection, mockedSectionsRepository } from '@/app/common/mocks';
import { SectionNotFoundException } from '@/domain/sections/exceptions';
import { UpdateSectionUseCase } from '../update.use-case';

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
			mockedSectionsRepository.update.mockResolvedValueOnce(mockedSection);

			const result = await updateSectionUseCase.execute({
				where: { id: mockedSection.id },
			});

			expect(result).toEqual(mockedSection);
		});
	});
});
