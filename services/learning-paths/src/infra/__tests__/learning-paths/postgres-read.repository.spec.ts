import { Test } from '@nestjs/testing';
import { PostgresLearningPathReadRepository } from '@/infra/learning-paths/postgres-read.repository';
import { mockedDbService, mockedDrizzle } from '../mocks';
import { makeLearningPathDto, TEST_IDS } from '../common';

describe('PostgresLearningPathReadRepository', () => {
	let repository: PostgresLearningPathReadRepository;

	beforeEach(async () => {
		jest.clearAllMocks();

		const module = await Test.createTestingModule({
			providers: [PostgresLearningPathReadRepository, mockedDbService],
		}).compile();

		repository = module.get(PostgresLearningPathReadRepository);
	});

	describe('list', () => {
		it('should call select → from → limit → offset and return results', async () => {
			const dto = makeLearningPathDto();
			mockedDrizzle.offset.mockResolvedValueOnce([dto]);

			const result = await repository.list();

			expect(mockedDrizzle.select).toHaveBeenCalled();
			expect(mockedDrizzle.from).toHaveBeenCalled();
			expect(mockedDrizzle.limit).toHaveBeenCalled();
			expect(mockedDrizzle.offset).toHaveBeenCalled();
			expect(result).toEqual([dto]);
		});

		it('should return empty array when no results', async () => {
			mockedDrizzle.offset.mockResolvedValueOnce([]);

			const result = await repository.list();

			expect(result).toEqual([]);
		});
	});

	describe('findById', () => {
		it('should return a learning path when found', async () => {
			const dto = makeLearningPathDto();
			mockedDrizzle.where.mockResolvedValueOnce([dto]);

			const result = await repository.findById(TEST_IDS.learningPath);

			expect(mockedDrizzle.select).toHaveBeenCalled();
			expect(mockedDrizzle.from).toHaveBeenCalled();
			expect(mockedDrizzle.where).toHaveBeenCalled();
			expect(result).toEqual(dto);
		});

		it('should return null when not found', async () => {
			mockedDrizzle.where.mockResolvedValueOnce([]);

			const result = await repository.findById(TEST_IDS.learningPath);

			expect(result).toBeNull();
		});
	});
});
