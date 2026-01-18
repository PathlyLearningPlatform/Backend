import {
	mockedSection,
	mockedSectionsRepository,
	mockedUnit,
	mockedUnitsRepository,
} from '@/app/common/mocks';
import { SectionNotFoundException } from '@/domain/sections/exceptions';
import { CreateUnitUseCase } from '../create.use-case';

describe('CreateUnitUseCase', () => {
	let createUnitUseCase: CreateUnitUseCase;

	beforeEach(() => {
		createUnitUseCase = new CreateUnitUseCase(
			mockedUnitsRepository,
			mockedSectionsRepository,
		);
	});

	describe('execute', () => {
		it('should return a unit', async () => {
			mockedSectionsRepository.findOne.mockResolvedValueOnce(mockedSection);

			mockedUnitsRepository.create.mockResolvedValueOnce(mockedUnit);

			const result = await createUnitUseCase.execute({
				name: mockedUnit.name,
				order: mockedUnit.order,
				sectionId: mockedUnit.sectionId,
				description: mockedUnit.description,
			});

			expect(result).toEqual(mockedUnit);
		});

		it('should throw SectionNotFoundException if section not found', async () => {
			mockedSectionsRepository.findOne.mockResolvedValueOnce(null);

			await expect(
				createUnitUseCase.execute({
					name: mockedUnit.name,
					order: mockedUnit.order,
					sectionId: mockedUnit.sectionId,
					description: mockedUnit.description,
				}),
			).rejects.toThrow(SectionNotFoundException);
		});
	});
});
