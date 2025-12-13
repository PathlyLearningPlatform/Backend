import { PathNotFoundException } from '@/domain/paths/exceptions';
import { UpdatePathUseCase } from '../update.use-case';
import { mockedUpdateCommand } from './mocks/commands.mock';
import { mockedPath, mockedUpdatedPath } from './mocks/paths.mock';
import { mockedPathsRepository } from './mocks/paths.repository.mock';

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
			const expectedResult = mockedUpdatedPath;

			mockedPathsRepository.update.mockResolvedValueOnce(mockedUpdatedPath);

			const result = await updatePathUseCase.execute(mockedUpdateCommand);

			expect(result).toEqual(expectedResult);
		});
	});
});
