import { Test } from '@nestjs/testing';
import { PostgresLearningPathRepository } from '@/infra/learning-paths/postgres.repository';
import { mockedDbService, mockedDrizzle, resetDrizzleMocks } from '../mocks';
import { DEFAULT_DATE } from '../common';
import {
	LearningPathId,
	LearningPathName,
} from '@/domain/learning-paths/value-objects';
import { LearningPath } from '@/domain/learning-paths/learning-path.aggregate';
import { RepositoryException } from '@pathly-backend/common/index.js';

const LP_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
const SECTION_ID = 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e';

describe('PostgresLearningPathRepository', () => {
	let repository: PostgresLearningPathRepository;

	beforeEach(async () => {
		resetDrizzleMocks();

		const module = await Test.createTestingModule({
			providers: [PostgresLearningPathRepository, mockedDbService],
		}).compile();

		repository = module.get(PostgresLearningPathRepository);
	});

	describe('load', () => {
		const id = LearningPathId.create(LP_ID);

		it('should return a learning path when found', async () => {
			const dbRow = {
				id: LP_ID,
				name: 'Test LP',
				description: null,
				createdAt: DEFAULT_DATE,
				updatedAt: null,
				sectionCount: 0,
			};

			mockedDrizzle.where
				.mockResolvedValueOnce([dbRow])
				.mockResolvedValueOnce([]);

			const result = await repository.load(id);

			expect(mockedDrizzle.transaction).toHaveBeenCalled();
			expect(mockedDrizzle.select).toHaveBeenCalledTimes(2);
			expect(mockedDrizzle.from).toHaveBeenCalledTimes(2);
			expect(mockedDrizzle.where).toHaveBeenCalledTimes(2);
			expect(result).toBeInstanceOf(LearningPath);
			expect(result!.id.value).toBe(LP_ID);
			expect(result!.name.value).toBe('Test LP');
		});

		it('should reconstruct section refs', async () => {
			const dbRow = {
				id: LP_ID,
				name: 'Test LP',
				description: 'A desc',
				createdAt: DEFAULT_DATE,
				updatedAt: DEFAULT_DATE,
				sectionCount: 1,
			};
			const sectionRefs = [{ order: 0, sectionId: SECTION_ID }];

			mockedDrizzle.where
				.mockResolvedValueOnce([dbRow])
				.mockResolvedValueOnce(sectionRefs);

			const result = await repository.load(id);

			expect(result).toBeInstanceOf(LearningPath);
			expect(result!.sectionCount).toBe(1);
		});

		it('should return null when not found', async () => {
			mockedDrizzle.where.mockResolvedValueOnce([]);

			const result = await repository.load(id);

			expect(result).toBeNull();
		});

		it('should throw RepositoryException on error', async () => {
			mockedDrizzle.transaction.mockRejectedValueOnce(new Error('db error'));

			await expect(repository.load(id)).rejects.toThrow(RepositoryException);
		});
	});

	describe('save', () => {
		it('should call insert → values → onConflictDoUpdate', async () => {
			mockedDrizzle.onConflictDoUpdate.mockResolvedValueOnce(undefined);

			const lp = LearningPath.fromDataSource(LearningPathId.create(LP_ID), {
				name: LearningPathName.create('Test LP'),
				description: null,
				createdAt: DEFAULT_DATE,
				updatedAt: null,
				sectionCount: 0,
				sectionRefs: [],
			});

			await repository.save(lp);

			expect(mockedDrizzle.insert).toHaveBeenCalled();
			expect(mockedDrizzle.values).toHaveBeenCalled();
			expect(mockedDrizzle.onConflictDoUpdate).toHaveBeenCalled();
		});

		it('should throw RepositoryException on error', async () => {
			mockedDrizzle.onConflictDoUpdate.mockRejectedValueOnce(
				new Error('db error'),
			);

			const lp = LearningPath.fromDataSource(LearningPathId.create(LP_ID), {
				name: LearningPathName.create('Test LP'),
				description: null,
				createdAt: DEFAULT_DATE,
				updatedAt: null,
				sectionCount: 0,
				sectionRefs: [],
			});

			await expect(repository.save(lp)).rejects.toThrow(RepositoryException);
		});
	});

	describe('remove', () => {
		const id = LearningPathId.create(LP_ID);

		it('should return true when entity was deleted', async () => {
			mockedDrizzle.where.mockResolvedValueOnce({ rows: [{}] });

			const result = await repository.remove(id);

			expect(mockedDrizzle.delete).toHaveBeenCalled();
			expect(mockedDrizzle.where).toHaveBeenCalled();
			expect(result).toBe(true);
		});

		it('should return false when entity was not found', async () => {
			mockedDrizzle.where.mockResolvedValueOnce({ rows: [] });

			const result = await repository.remove(id);

			expect(result).toBe(false);
		});

		it('should throw RepositoryException on error', async () => {
			mockedDrizzle.where.mockRejectedValueOnce(new Error('db error'));

			await expect(repository.remove(id)).rejects.toThrow(
				RepositoryException,
			);
		});
	});
});
