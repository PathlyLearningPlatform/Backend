import { PG_FOREIGN_KEY_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import { Test } from '@nestjs/testing';
import {
	RepositoryException,
	InvalidReferenceException,
} from '@pathly-backend/common/index.js';
import { DrizzleQueryError } from 'drizzle-orm';
import { DatabaseError as PostgresError } from 'pg';
import { mockedLearningPath } from '@/app/common/mocks';
import { mockedDbService, mockedDrizzle } from '@/infra/common/mocks';
import { LearningPathsApiConstraints } from '../enums';
import { PostgresLearningPathsRepository } from '../postgres.repository';
import { mockedDbLearningPath } from './mocks/learning-paths.mock';

describe('LearningPathsRepository', () => {
	let learningPathsRepository: PostgresLearningPathsRepository;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [mockedDbService, PostgresLearningPathsRepository],
		}).compile();

		learningPathsRepository = moduleRef.get(PostgresLearningPathsRepository);
	});

	describe('find', () => {
		it('should return an array of learning paths', async () => {
			mockedDrizzle.offset.mockResolvedValueOnce([mockedDbLearningPath]);

			const result = await learningPathsRepository.find({});

			expect(result).toEqual([mockedLearningPath]);
			expect(result.length).toBeLessThanOrEqual(
				LearningPathsApiConstraints.DEFAULT_LIMIT,
			);
		});

		it('should throw RepositoryException', async () => {
			mockedDrizzle.offset.mockRejectedValueOnce(new Error());

			const promise = learningPathsRepository.find({});

			await expect(promise).rejects.toThrow(RepositoryException);
		});
	});

	describe('findOne', () => {
		it('should return a learning path', async () => {
			mockedDrizzle.where.mockResolvedValueOnce([mockedDbLearningPath]);

			const result = await learningPathsRepository.findOne(
				mockedDbLearningPath.id,
			);

			expect(result).toEqual(mockedLearningPath);
		});

		it('should return null', async () => {
			mockedDrizzle.where.mockResolvedValueOnce([]);

			const result = await learningPathsRepository.findOne(
				'non-existent-learning-path-id',
			);

			expect(result).toEqual(null);
		});

		it('should throw RepositoryException', async () => {
			mockedDrizzle.where.mockResolvedValueOnce(new Error());

			const promise = learningPathsRepository.findOne(mockedDbLearningPath.id);

			await expect(promise).rejects.toThrow(RepositoryException);
		});
	});

	describe('save', () => {
		it('should return undefined', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([mockedDbLearningPath]);

			const result = await learningPathsRepository.save(mockedLearningPath);

			expect(result).toBeUndefined();
		});

		it('should throw RepositoryException', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce(new Error());

			const promise = learningPathsRepository.save(mockedLearningPath);

			await expect(promise).rejects.toThrow(RepositoryException);
		});
	});

	describe('remove', () => {
		it('should return true', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([mockedDbLearningPath]);

			const result = await learningPathsRepository.remove(
				mockedLearningPath.id,
			);

			expect(result).toBe(true);
		});

		it('should return false', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([]);

			const result = await learningPathsRepository.remove(
				'non-existent-learning-path-id',
			);

			expect(result).toBe(false);
		});

		it('should throw RepositoryException', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce(new Error());

			const promise = learningPathsRepository.remove(mockedLearningPath.id);

			await expect(promise).rejects.toThrow(RepositoryException);
		});

		it('should throw InvalidReferenceException', async () => {
			const pgErr = new PostgresError('', 0, 'error');
			pgErr.code = PG_FOREIGN_KEY_VIOLATION;

			const drizzleErr = new DrizzleQueryError('', [], pgErr);

			mockedDrizzle.returning.mockRejectedValueOnce(drizzleErr);

			const promise = learningPathsRepository.remove(mockedLearningPath.id);

			await expect(promise).rejects.toThrow(InvalidReferenceException);
		});
	});
});
