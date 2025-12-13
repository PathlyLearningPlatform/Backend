import { CreatePathUseCase } from '../create.use-case';
import { mockedCreateCommand } from './mocks/commands.mock';
import { mockedPath } from './mocks/paths.mock';
import { mockedPathsRepository } from './mocks/paths.repository.mock';

describe('CreatePathUseCase', () => {
	let createPathUseCase: CreatePathUseCase;

	beforeEach(() => {
		createPathUseCase = new CreatePathUseCase(mockedPathsRepository);
	});

	describe('execute', () => {
		it('should return a path', async () => {
			const path = mockedPath;

			mockedPathsRepository.create.mockResolvedValueOnce(mockedPath);

			const result = await createPathUseCase.execute(mockedCreateCommand);

			expect(result).toEqual(path);
		});
	});
});
