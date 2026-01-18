import { mockedUnit, mockedUnitsRepository } from '@/app/common/mocks';
import { FindUnitsUseCase } from '../find.use-case';

describe('FindUnitsUseCase', () => {
	let findUnitsUseCase: FindUnitsUseCase;

	beforeEach(() => {
		findUnitsUseCase = new FindUnitsUseCase(mockedUnitsRepository);
	});

	describe('execute', () => {
		it('should return an array of units', async () => {
			mockedUnitsRepository.find.mockResolvedValueOnce([mockedUnit]);

			const result = await findUnitsUseCase.execute({});

			expect(result).toEqual([mockedUnit]);
		});
	});
});
