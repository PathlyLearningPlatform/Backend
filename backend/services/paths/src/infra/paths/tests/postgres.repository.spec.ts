import { Test } from '@nestjs/testing';
import {
	DbException,
	InvalidReferenceException,
} from '@pathly-backend/common/index.js';
import { PostgresPathsRepository } from '../postgres.repository';
import { mockedDrizzle, mockedDbService } from '@/infra/common/mocks';
import { mockedDbPath } from './mocks/paths.mock';
import { PathsApiConstraints } from '../enums';
import { PG_FOREIGN_KEY_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import { DatabaseError as PostgresError } from 'pg';
import { DrizzleQueryError } from 'drizzle-orm';
import { mockedPath } from '@/app/common/mocks';

describe('PathsRepository', () => {
	let pathsRepository: PostgresPathsRepository;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [mockedDbService, PostgresPathsRepository],
		}).compile();

		pathsRepository = moduleRef.get(PostgresPathsRepository);
	});

	describe('find', () => {
		it('should return an array of paths', async () => {
			mockedDrizzle.offset.mockResolvedValueOnce([mockedDbPath]);

			const result = await pathsRepository.find({});

			expect(result).toEqual([mockedPath]);
			expect(result.length).toBeLessThanOrEqual(
				PathsApiConstraints.DEFAULT_LIMIT,
			);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.offset.mockRejectedValueOnce(new Error());

			const promise = pathsRepository.find({});

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('findOne', () => {
		it('should return a path', async () => {
			mockedDrizzle.where.mockResolvedValueOnce([mockedDbPath]);

			const result = await pathsRepository.findOne({
				where: { id: mockedPath.id },
			});

			expect(result).toEqual(mockedPath);
		});

		it('should return null', async () => {
			mockedDrizzle.where.mockResolvedValueOnce([]);

			const result = await pathsRepository.findOne({
				where: { id: 'non-existent-path-id' },
			});

			expect(result).toEqual(null);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.where.mockResolvedValueOnce(new Error());

			const promise = pathsRepository.findOne({
				where: { id: mockedPath.id },
			});

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('create', () => {
		it('should return created path', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([mockedDbPath]);

			const result = await pathsRepository.create({
				name: mockedPath.name,
			});

			expect(result).toEqual(mockedPath);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce(new Error());

			const promise = pathsRepository.create({
				name: mockedPath.name,
			});

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('update', () => {
		it('should return updated path', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([mockedDbPath]);

			const result = await pathsRepository.update({
				where: { id: mockedPath.id },
			});

			expect(result).toEqual(mockedPath);
		});

		it('should return null', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([]);

			const result = await pathsRepository.update({
				where: { id: 'non-existent-path-id' },
			});

			expect(result).toEqual(null);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce(new Error());

			const promise = pathsRepository.update({
				where: { id: mockedPath.id },
			});

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('remove', () => {
		it('should return removed path', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([mockedDbPath]);

			const result = await pathsRepository.remove({
				where: { id: mockedPath.id },
			});

			expect(result).toEqual(mockedPath);
		});

		it('should return null', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([]);

			const result = await pathsRepository.remove({
				where: { id: 'non-existent-path-id' },
			});

			expect(result).toEqual(null);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce(new Error());

			const promise = pathsRepository.remove({
				where: { id: mockedPath.id },
			});

			await expect(promise).rejects.toThrow(DbException);
		});

		it('should throw InvalidReferenceException', async () => {
			const pgErr = new PostgresError('', 0, 'error');
			pgErr.code = PG_FOREIGN_KEY_VIOLATION;

			const drizzleErr = new DrizzleQueryError('', [], pgErr);

			mockedDrizzle.returning.mockResolvedValueOnce(drizzleErr);

			const promise = pathsRepository.remove({
				where: { id: mockedPath.id },
			});

			await expect(promise).rejects.toThrow(InvalidReferenceException);
		});
	});
});
