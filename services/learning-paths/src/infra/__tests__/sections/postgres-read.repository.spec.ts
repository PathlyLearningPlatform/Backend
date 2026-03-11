import { Test } from '@nestjs/testing';
import { PostgresSectionReadRepository } from '@/infra/sections/postgres-read.repository';
import { mockedDbService, mockedDrizzle } from '../mocks';
import { makeSectionDto, TEST_IDS } from '../common';

describe('PostgresSectionReadRepository', () => {
	let repository: PostgresSectionReadRepository;

	beforeEach(async () => {
		jest.clearAllMocks();

		const module = await Test.createTestingModule({
			providers: [PostgresSectionReadRepository, mockedDbService],
		}).compile();

		repository = module.get(PostgresSectionReadRepository);
	});

	describe('list', () => {
		it('should call select chain and return results', async () => {
			const dto = makeSectionDto();
			mockedDrizzle.offset.mockResolvedValueOnce([dto]);

			const result = await repository.list({
				where: { learningPathId: TEST_IDS.learningPath },
				options: {},
			});

			expect(mockedDrizzle.select).toHaveBeenCalled();
			expect(mockedDrizzle.from).toHaveBeenCalled();
			expect(result).toEqual([dto]);
		});

		it('should return empty array when no results', async () => {
			mockedDrizzle.offset.mockResolvedValueOnce([]);

			const result = await repository.list();

			expect(result).toEqual([]);
		});
	});

	describe('findById', () => {
		it('should return a section when found', async () => {
			const dto = makeSectionDto();
			mockedDrizzle.where.mockResolvedValueOnce([dto]);

			const result = await repository.findById(TEST_IDS.section);

			expect(result).toEqual(dto);
		});

		it('should return null when not found', async () => {
			mockedDrizzle.where.mockResolvedValueOnce([]);

			const result = await repository.findById(TEST_IDS.section);

			expect(result).toBeNull();
		});
	});
});
