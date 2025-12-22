import {
	PathCannotBeRemovedException,
	PathNotFoundException,
} from '@/domain/paths/exceptions';
import { RemovePathUseCase } from '../use-cases';
import { mockedRemoveCommand } from './mocks/commands.mock';
import { mockedPath } from './mocks/paths.mock';
import { mockedPathsRepository } from './mocks/paths.repository.mock';
import { InvalidReferenceException } from '@pathly-backend/common/index.js';

describe('RemovePathUseCase', () => {
	let removePathUseCase: RemovePathUseCase;

	beforeEach(() => {
		removePathUseCase = new RemovePathUseCase(mockedPathsRepository);
	});

	describe('execute', () => {
		it('should throw PathNotFoundException', async () => {
			mockedPathsRepository.remove.mockResolvedValueOnce(null);

			const promise = removePathUseCase.execute({
				where: {
					id: 'unknown id',
				},
			});

			await expect(promise).rejects.toThrow(PathNotFoundException);
		});

		it('should throw PathCannotBeRemovedException', async () => {
			mockedPathsRepository.remove.mockRejectedValueOnce(
				new InvalidReferenceException(''),
			);

			const promise = removePathUseCase.execute({
				where: {
					id: mockedPath.id
				}
			})

			await expect(promise).rejects.toThrow(PathCannotBeRemovedException)
		});

		it('should return a path', async () => {
			const expectedResult = mockedPath;

			mockedPathsRepository.remove.mockResolvedValueOnce(mockedPath);

			const result = await removePathUseCase.execute(mockedRemoveCommand);

			expect(result).toEqual(expectedResult);
		});
	});
});
