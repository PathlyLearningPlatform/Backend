import { InvalidReferenceException } from '@pathly-backend/common/index.js';
import { mockedUnit, mockedUnitsRepository } from '@/app/common/mocks';
import {
	UnitCannotBeRemovedException,
	UnitNotFoundException,
} from '@/domain/units/exceptions';
import { RemoveUnitUseCase } from '../remove.use-case';

describe('RemoveUnitUseCase', () => {
	let removeUnitUseCase: RemoveUnitUseCase;

	beforeEach(() => {
		removeUnitUseCase = new RemoveUnitUseCase(mockedUnitsRepository);
	});

	describe('execute', () => {
		it('should return a unit', async () => {
			mockedUnitsRepository.remove.mockResolvedValueOnce(mockedUnit);

			const result = await removeUnitUseCase.execute({
				where: { id: mockedUnit.id },
			});

			expect(result).toEqual(mockedUnit);
		});

		it('should throw UnitNotFoundException', async () => {
			mockedUnitsRepository.remove.mockResolvedValueOnce(null);

			await expect(
				removeUnitUseCase.execute({ where: { id: mockedUnit.id } }),
			).rejects.toThrow(UnitNotFoundException);
		});

		it('should throw UnitCannotBeRemovedException when InvalidReferenceException is thrown', async () => {
			mockedUnitsRepository.remove.mockRejectedValueOnce(
				new InvalidReferenceException(''),
			);

			await expect(
				removeUnitUseCase.execute({ where: { id: mockedUnit.id } }),
			).rejects.toThrow(UnitCannotBeRemovedException);
		});
	});
});
