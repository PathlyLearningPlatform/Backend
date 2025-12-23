import { PathNotFoundException } from '@/domain/paths/exceptions';
import { FindOnePathUseCase } from '../find-one.use-case';
import { mockedPath, mockedPathsRepository } from '@/app/common/mocks';

describe('FindOnePathUseCase', () => {
	let findOnePathUseCase: FindOnePathUseCase;

	beforeEach(() => {
		findOnePathUseCase = new FindOnePathUseCase(mockedPathsRepository);
	});

	describe('execute', () => {
		it('should throw a PathNotFoundException', async () => {
			mockedPathsRepository.findOne.mockResolvedValueOnce(null);

			const promise = findOnePathUseCase.execute({
				where: {
					id: 'unknown id',
				},
			});

			await expect(promise).rejects.toThrow(PathNotFoundException);
		});

		it('should return a path', async () => {
			mockedPathsRepository.findOne.mockResolvedValueOnce(mockedPath);

			const result = await findOnePathUseCase.execute({
				where: { id: mockedPath.id },
			});

			expect(result).toEqual(mockedPath);
		});
	});
});
