import { PathNotFoundException } from '@/domain/paths/exceptions';
import { UpdatePathUseCase } from '../update.use-case';
import { mockedPath, mockedPathsRepository } from '@/app/common/mocks';

describe('UpdatePathUseCase', () => {
	let updatePathUseCase: UpdatePathUseCase;

	beforeEach(() => {
		updatePathUseCase = new UpdatePathUseCase(mockedPathsRepository);
	});

	describe('execute', () => {
		it('should throw a PathNotFoundException', async () => {
			mockedPathsRepository.update.mockResolvedValueOnce(null);

			const promise = updatePathUseCase.execute({
				where: {
					id: 'unknown id',
				},
			});

			await expect(promise).rejects.toThrow(PathNotFoundException);
		});

		it('should return a path', async () => {
			mockedPathsRepository.update.mockResolvedValueOnce(mockedPath);

			const result = await updatePathUseCase.execute({
				where: { id: mockedPath.id },
			});

			expect(result).toEqual(mockedPath);
		});
	});
});
