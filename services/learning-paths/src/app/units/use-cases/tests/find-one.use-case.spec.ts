import { mockedUnit, mockedUnitsRepository } from '@/app/common/mocks';
import { UnitNotFoundException } from '@/domain/units/exceptions';
import { FindOneUnitUseCase } from '../find-one.use-case';

describe('FindOneUnitUseCase', () => {
	let findOneUnitUseCase: FindOneUnitUseCase;

	beforeEach(() => {
		findOneUnitUseCase = new FindOneUnitUseCase(mockedUnitsRepository);
	});

	describe('execute', () => {
		it('should return a unit', async () => {
			mockedUnitsRepository.findOne.mockResolvedValueOnce(mockedUnit);

			const result = await findOneUnitUseCase.execute({
				where: { id: mockedUnit.id },
			});

			expect(result).toEqual(mockedUnit);
		});

		it('should throw UnitNotFoundException', async () => {
			mockedUnitsRepository.findOne.mockResolvedValueOnce(null);

			await expect(
				findOneUnitUseCase.execute({ where: { id: mockedUnit.id } }),
			).rejects.toThrow(UnitNotFoundException);
		});
	});
});
