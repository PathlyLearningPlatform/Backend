import { Test } from '@nestjs/testing';
import {
	DbException,
	InvalidReferenceException,
} from '@pathly-backend/common/index.js';
import {
	mockedCreateCommand,
	mockedFindCommand,
	mockedFindOneCommand,
	mockedRemoveCommand,
	mockedUpdateCommand,
} from '@/app/paths/tests/mocks/commands.mock';
import { PostgresPathsRepository } from '../postgres.repository';
import { mockedDb, mockedDbService } from './mocks/db.mock';
import { mockedDbPath, mockedPath } from './mocks/paths.mock';
import { PathsApiConstraints } from '../enums';
import { PG_FOREIGN_KEY_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import { DatabaseError as PostgresError } from 'pg';
import { DrizzleQueryError } from 'drizzle-orm';

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
			mockedDb.offset.mockResolvedValueOnce([mockedDbPath]);

			const result = await pathsRepository.find(mockedFindCommand);

			expect(result).toEqual([mockedPath]);
			expect(result.length).toBeLessThanOrEqual(
				PathsApiConstraints.DEFAULT_LIMIT,
			);
		});

		it('should throw DbException', async () => {
			mockedDb.offset.mockRejectedValueOnce(new Error());

			const promise = pathsRepository.find(mockedFindCommand);

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('findOne', () => {
		it('should return a path', async () => {
			mockedDb.where.mockResolvedValueOnce([mockedDbPath]);

			const result = await pathsRepository.findOne(mockedFindOneCommand);

			expect(result).toEqual(mockedPath);
		});

		it('should return null', async () => {
			mockedDb.where.mockResolvedValueOnce([]);

			const result = await pathsRepository.findOne(mockedFindOneCommand);

			expect(result).toEqual(null);
		});

		it('should throw DbException', async () => {
			mockedDb.where.mockResolvedValueOnce(new Error());

			const promise = pathsRepository.findOne(mockedFindOneCommand);

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('create', () => {
		it('should return created path', async () => {
			mockedDb.returning.mockResolvedValueOnce([mockedDbPath]);

			const result = await pathsRepository.create(mockedCreateCommand);

			expect(result).toEqual(mockedPath);
		});

		it('should throw DbException', async () => {
			mockedDb.returning.mockResolvedValueOnce(new Error());

			const promise = pathsRepository.create(mockedCreateCommand);

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('update', () => {
		it('should return updated path', async () => {
			mockedDb.returning.mockResolvedValueOnce([mockedDbPath]);

			const result = await pathsRepository.update(mockedUpdateCommand);

			expect(result).toEqual(mockedPath);
		});

		it('should return null', async () => {
			mockedDb.returning.mockResolvedValueOnce([]);

			const result = await pathsRepository.update(mockedUpdateCommand);

			expect(result).toEqual(null);
		});

		it('should throw DbException', async () => {
			mockedDb.returning.mockResolvedValueOnce(new Error());

			const promise = pathsRepository.update(mockedUpdateCommand);

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('remove', () => {
		it('should return removed path', async () => {
			mockedDb.returning.mockResolvedValueOnce([mockedDbPath]);

			const result = await pathsRepository.remove(mockedRemoveCommand);

			expect(result).toEqual(mockedPath);
		});

		it('should return null', async () => {
			mockedDb.returning.mockResolvedValueOnce([]);

			const result = await pathsRepository.remove(mockedRemoveCommand);

			expect(result).toEqual(null);
		});

		it('should throw DbException', async () => {
			mockedDb.returning.mockResolvedValueOnce(new Error());

			const promise = pathsRepository.remove(mockedRemoveCommand);

			await expect(promise).rejects.toThrow(DbException);
		});

		it('should throw InvalidReferenceException', async () => {
			const pgErr = new PostgresError('', 0, 'error');
			pgErr.code = PG_FOREIGN_KEY_VIOLATION;

			const drizzleErr = new DrizzleQueryError('', [], pgErr);

			mockedDb.returning.mockResolvedValueOnce(drizzleErr);

			const promise = pathsRepository.remove(mockedRemoveCommand);

			await expect(promise).rejects.toThrow(InvalidReferenceException);
		});
	});
});
