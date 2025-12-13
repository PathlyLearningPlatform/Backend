import { PathNotFoundException } from '@/domain/paths/exceptions';
import { RemovePathUseCase } from '../remove.use-case';
import { mockedRemoveCommand } from './mocks/commands.mock';
import { mockedPath } from './mocks/paths.mock';
import { mockedPathsRepository } from './mocks/paths.repository.mock';

describe('RemovePathUseCase', () => {
	let removePathUseCase: RemovePathUseCase;

	beforeEach(() => {
		removePathUseCase = new RemovePathUseCase(mockedPathsRepository);
	});

	describe('execute', () => {
		it('should throw a PathNotFoundException', async () => {
			mockedPathsRepository.remove.mockResolvedValueOnce(null);

			const promise = removePathUseCase.execute({
				where: {
					id: 'unknown id',
				},
			});

			await expect(promise).rejects.toThrow(PathNotFoundException);
		});

		it('should return a path', async () => {
			const expectedResult = mockedPath;

			mockedPathsRepository.remove.mockResolvedValueOnce(mockedPath);

			const result = await removePathUseCase.execute(mockedRemoveCommand);

			expect(result).toEqual(expectedResult);
		});
	});
});
