import { SectionNotFoundException } from '@/domain/sections/exceptions';
import { UpdateSectionUseCase } from '../update.use-case';
import {
	mockedPath,
	mockedSection,
	mockedPathsRepository,
	mockedSectionsRepository,
} from '@/app/common/mocks';

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
			mockedPathsRepository.findOne.mockResolvedValueOnce(mockedPath);
			mockedSectionsRepository.update.mockResolvedValueOnce(mockedSection);

			const result = await updateSectionUseCase.execute({
				where: { id: mockedSection.id },
			});

			expect(result).toEqual(mockedSection);
		});
	});
});
