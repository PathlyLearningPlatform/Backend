import {
	PathCannotBeRemovedException,
	PathNotFoundException,
} from '@/domain/paths/exceptions';
import { RemovePathUseCase } from '../remove.use-case';
import { InvalidReferenceException } from '@pathly-backend/common/index.js';
import { mockedPath, mockedPathsRepository } from '@/app/common/mocks';

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
					id: mockedPath.id,
				},
			});

			await expect(promise).rejects.toThrow(PathCannotBeRemovedException);
		});

		it('should return a path', async () => {
			mockedPathsRepository.remove.mockResolvedValueOnce(mockedPath);

			const result = await removePathUseCase.execute({
				where: { id: mockedPath.id },
			});

			expect(result).toEqual(mockedPath);
		});
	});
});
