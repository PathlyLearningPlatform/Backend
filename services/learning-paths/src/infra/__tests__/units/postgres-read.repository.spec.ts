import { Test } from '@nestjs/testing';
import { PostgresUnitReadRepository } from '@/infra/units/postgres-read.repository';
import { mockedDbService, mockedDrizzle } from '../mocks';
import { makeUnitDto, TEST_IDS } from '../common';

describe('PostgresUnitReadRepository', () => {
	let repository: PostgresUnitReadRepository;

	beforeEach(async () => {
		jest.clearAllMocks();

		const module = await Test.createTestingModule({
			providers: [PostgresUnitReadRepository, mockedDbService],
		}).compile();

		repository = module.get(PostgresUnitReadRepository);
	});

	describe('list', () => {
		it('should call select chain and return results', async () => {
			const dto = makeUnitDto();
			mockedDrizzle.offset.mockResolvedValueOnce([dto]);

			const result = await repository.list({
				where: { sectionId: TEST_IDS.section },
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
		it('should return a unit when found', async () => {
			const dto = makeUnitDto();
			mockedDrizzle.where.mockResolvedValueOnce([dto]);

			const result = await repository.findById(TEST_IDS.unit);

			expect(result).toEqual(dto);
		});

		it('should return null when not found', async () => {
			mockedDrizzle.where.mockResolvedValueOnce([]);

			const result = await repository.findById(TEST_IDS.unit);

			expect(result).toBeNull();
		});
	});
});
