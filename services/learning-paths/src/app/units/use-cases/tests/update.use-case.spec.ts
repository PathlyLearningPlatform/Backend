import { mockedUnit, mockedUnitsRepository } from '@/app/common/mocks';
import { UnitNotFoundException } from '@/domain/units/exceptions';
import { UpdateUnitUseCase } from '../update.use-case';

describe('UpdateUnitUseCase', () => {
	let updateUnitUseCase: UpdateUnitUseCase;

	beforeEach(() => {
		updateUnitUseCase = new UpdateUnitUseCase(mockedUnitsRepository);
	});

	describe('execute', () => {
		it('should return a unit', async () => {
			mockedUnitsRepository.update.mockResolvedValueOnce(mockedUnit);

			const result = await updateUnitUseCase.execute({
				where: { id: mockedUnit.id },
				fields: { name: mockedUnit.name },
			});

			expect(result).toEqual(mockedUnit);
		});

		it('should throw UnitNotFoundException', async () => {
			mockedUnitsRepository.update.mockResolvedValueOnce(null);

			await expect(
				updateUnitUseCase.execute({
					where: { id: mockedUnit.id },
					fields: { name: mockedUnit.name },
				}),
			).rejects.toThrow(UnitNotFoundException);
		});
	});
});
