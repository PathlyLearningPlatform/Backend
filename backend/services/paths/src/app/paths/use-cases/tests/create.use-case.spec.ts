import { CreatePathUseCase } from '../create.use-case';
import { mockedPath, mockedPathsRepository } from '@/app/common/mocks';

describe('CreatePathUseCase', () => {
	let createPathUseCase: CreatePathUseCase;

	beforeEach(() => {
		createPathUseCase = new CreatePathUseCase(mockedPathsRepository);
	});

	describe('execute', () => {
		it('should return a path', async () => {
			mockedPathsRepository.create.mockResolvedValueOnce(mockedPath);

			const result = await createPathUseCase.execute({
				name: mockedPath.name,
			});

			expect(result).toEqual(mockedPath);
		});
	});
});
