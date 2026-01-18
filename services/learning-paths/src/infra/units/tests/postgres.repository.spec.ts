import { PG_FOREIGN_KEY_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import { Test } from '@nestjs/testing';
import {
	DbException,
	InvalidReferenceException,
} from '@pathly-backend/common/index.js';
import { DrizzleQueryError } from 'drizzle-orm';
import { DatabaseError as PostgresError } from 'pg';
import { mockedUnit } from '@/app/common/mocks';
import { mockedDbService, mockedDrizzle } from '@/infra/common/mocks';
import { UnitsApiConstraints } from '../enums';
import { PostgresUnitsRepository } from '../postgres.repository';
import { mockedDbUnit } from './mocks/units.mock';

describe('UnitsRepository', () => {
	let unitsRepository: PostgresUnitsRepository;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [mockedDbService, PostgresUnitsRepository],
		}).compile();

		unitsRepository = moduleRef.get(PostgresUnitsRepository);
	});

	describe('find', () => {
		it('should return an array of units', async () => {
			mockedDrizzle.offset.mockResolvedValueOnce([mockedDbUnit]);

			const result = await unitsRepository.find({});

			expect(result).toEqual([mockedUnit]);
			expect(result.length).toBeLessThanOrEqual(
				UnitsApiConstraints.DEFAULT_LIMIT,
			);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.offset.mockRejectedValueOnce(new Error());

			const promise = unitsRepository.find({});

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('findOne', () => {
		it('should return a unit', async () => {
			mockedDrizzle.where.mockResolvedValueOnce([mockedDbUnit]);

			const result = await unitsRepository.findOne({
				where: { id: mockedUnit.id },
			});

			expect(result).toEqual(mockedUnit);
		});

		it('should return null', async () => {
			mockedDrizzle.where.mockResolvedValueOnce([]);

			const result = await unitsRepository.findOne({
				where: { id: 'non-existent-unit-id' },
			});

			expect(result).toEqual(null);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.where.mockResolvedValueOnce(new Error());

			const promise = unitsRepository.findOne({
				where: { id: mockedUnit.id },
			});

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('create', () => {
		it('should return created unit', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([mockedDbUnit]);

			const result = await unitsRepository.create({
				name: mockedUnit.name,
				description: null,
				order: mockedUnit.order,
				sectionId: mockedUnit.sectionId,
			});

			expect(result).toEqual(mockedUnit);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce(new Error());

			const promise = unitsRepository.create({
				name: mockedUnit.name,
				description: null,
				order: mockedUnit.order,
				sectionId: mockedUnit.sectionId,
			});

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('update', () => {
		it('should return updated unit', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([mockedDbUnit]);

			const result = await unitsRepository.update({
				where: { id: mockedUnit.id },
			});

			expect(result).toEqual(mockedUnit);
		});

		it('should return null', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([]);

			const result = await unitsRepository.update({
				where: { id: 'non-existent-unit-id' },
			});

			expect(result).toEqual(null);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce(new Error());

			const promise = unitsRepository.update({
				where: { id: mockedUnit.id },
			});

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('remove', () => {
		it('should return removed unit', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([mockedDbUnit]);

			const result = await unitsRepository.remove({
				where: { id: mockedUnit.id },
			});

			expect(result).toEqual(mockedUnit);
		});

		it('should return null', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([]);

			const result = await unitsRepository.remove({
				where: { id: 'non-existent-unit-id' },
			});

			expect(result).toEqual(null);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce(new Error());

			const promise = unitsRepository.remove({
				where: { id: mockedUnit.id },
			});

			await expect(promise).rejects.toThrow(DbException);
		});

		it('should throw InvalidReferenceException', async () => {
			const pgErr = new PostgresError('', 0, 'error');
			pgErr.code = PG_FOREIGN_KEY_VIOLATION;

			const drizzleErr = new DrizzleQueryError('', [], pgErr);

			mockedDrizzle.returning.mockRejectedValueOnce(drizzleErr);

			const promise = unitsRepository.remove({
				where: { id: mockedUnit.id },
			});

			await expect(promise).rejects.toThrow(InvalidReferenceException);
		});
	});
});
