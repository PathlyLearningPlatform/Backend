import { Test } from '@nestjs/testing';
import {
	DbException,
	InvalidReferenceException,
} from '@pathly-backend/common/index.js';
import { PostgresLearningPathsRepository } from '../postgres.repository';
import { mockedDrizzle, mockedDbService } from '@/infra/common/mocks';
import { mockedDbLearningPath } from './mocks/learning-paths.mock';
import { LearningPathsApiConstraints } from '../enums';
import { PG_FOREIGN_KEY_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import { DatabaseError as PostgresError } from 'pg';
import { DrizzleQueryError } from 'drizzle-orm';
import { mockedLearningPath } from '@/app/common/mocks'

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

		it('should throw DbException', async () => {
			mockedDrizzle.offset.mockRejectedValueOnce(new Error());

			const promise = learningPathsRepository.find({});

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('findOne', () => {
		it('should return a learning path', async () => {
			mockedDrizzle.where.mockResolvedValueOnce([mockedDbLearningPath]);

			const result = await learningPathsRepository.findOne({
				where: { id: mockedLearningPath.id },
			});

			expect(result).toEqual(mockedLearningPath);
		});

		it('should return null', async () => {
			mockedDrizzle.where.mockResolvedValueOnce([]);

			const result = await learningPathsRepository.findOne({
				where: { id: 'non-existent-learning-path-id' },
			});

			expect(result).toEqual(null);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.where.mockResolvedValueOnce(new Error());

			const promise = learningPathsRepository.findOne({
				where: { id: mockedLearningPath.id },
			});

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('create', () => {
		it('should return created learning path', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([mockedDbLearningPath]);

			const result = await learningPathsRepository.create({
				name: mockedLearningPath.name,
			});

			expect(result).toEqual(mockedLearningPath);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce(new Error());

			const promise = learningPathsRepository.create({
				name: mockedLearningPath.name,
			});

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('update', () => {
		it('should return updated learning path', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([mockedDbLearningPath]);

			const result = await learningPathsRepository.update({
				where: { id: mockedLearningPath.id },
			});

			expect(result).toEqual(mockedLearningPath);
		});

		it('should return null', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([]);

			const result = await learningPathsRepository.update({
				where: { id: 'non-existent-learning-path-id' },
			});

			expect(result).toEqual(null);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce(new Error());

			const promise = learningPathsRepository.update({
				where: { id: mockedLearningPath.id },
			});

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('remove', () => {
		it('should return removed learning path', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([mockedDbLearningPath]);

			const result = await learningPathsRepository.remove({
				where: { id: mockedLearningPath.id },
			});

			expect(result).toEqual(mockedLearningPath);
		});

		it('should return null', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([]);

			const result = await learningPathsRepository.remove({
				where: { id: 'non-existent-learning-path-id' },
			});

			expect(result).toEqual(null);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce(new Error());

			const promise = learningPathsRepository.remove({
				where: { id: mockedLearningPath.id },
			});

			await expect(promise).rejects.toThrow(DbException);
		});

		it('should throw InvalidReferenceException', async () => {
			const pgErr = new PostgresError('', 0, 'error');
			pgErr.code = PG_FOREIGN_KEY_VIOLATION;

			const drizzleErr = new DrizzleQueryError('', [], pgErr);

			mockedDrizzle.returning.mockRejectedValueOnce(drizzleErr);

			const promise = learningPathsRepository.remove({
				where: { id: mockedLearningPath.id },
			});

			await expect(promise).rejects.toThrow(InvalidReferenceException);
		});
	});
});
