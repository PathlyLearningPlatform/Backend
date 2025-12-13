import type { Path } from '@/domain/paths/entities';
import { FindPathsUseCase } from '../find.use-case';
import { mockedPath } from './mocks/paths.mock';
import { mockedPathsRepository } from './mocks/paths.repository.mock';

describe('FindPathsUseCase', () => {
	let findPathsUseCase: FindPathsUseCase;

	beforeEach(() => {
		findPathsUseCase = new FindPathsUseCase(mockedPathsRepository);
	});

	describe('execute', () => {
		it('should return an array of paths', async () => {
			const expectedResult: Path[] = [mockedPath];

			mockedPathsRepository.find.mockResolvedValueOnce([mockedPath]);

			const result = await findPathsUseCase.execute({});

			expect(result).toEqual(expectedResult);
		});
	});
});
