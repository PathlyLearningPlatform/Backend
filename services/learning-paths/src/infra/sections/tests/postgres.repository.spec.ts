import { PG_FOREIGN_KEY_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import { Test } from '@nestjs/testing';
import {
	DbException,
	InvalidReferenceException,
} from '@pathly-backend/common/index.js';
import { DrizzleQueryError } from 'drizzle-orm';
import { DatabaseError as PostgresError } from 'pg';
import { mockedSection } from '@/app/common/mocks';
import { mockedDbService, mockedDrizzle } from '@/infra/common/mocks';
import { SectionsApiConstraints } from '../enums';
import { PostgresSectionsRepository } from '../postgres.repository';
import { mockedDbSection } from './mocks/sections.mock';

describe('SectionsRepository', () => {
	let sectionsRepository: PostgresSectionsRepository;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [mockedDbService, PostgresSectionsRepository],
		}).compile();

		sectionsRepository = moduleRef.get(PostgresSectionsRepository);
	});

	describe('find', () => {
		it('should return an array of sections', async () => {
			mockedDrizzle.offset.mockResolvedValueOnce([mockedDbSection]);

			const result = await sectionsRepository.find({});

			expect(result).toEqual([mockedSection]);
			expect(result.length).toBeLessThanOrEqual(
				SectionsApiConstraints.DEFAULT_LIMIT,
			);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.offset.mockRejectedValueOnce(new Error());

			const promise = sectionsRepository.find({});

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('findOne', () => {
		it('should return a section', async () => {
			mockedDrizzle.where.mockResolvedValueOnce([mockedDbSection]);

			const result = await sectionsRepository.findOne({
				where: { id: mockedSection.id },
			});

			expect(result).toEqual(mockedSection);
		});

		it('should return null', async () => {
			mockedDrizzle.where.mockResolvedValueOnce([]);

			const result = await sectionsRepository.findOne({
				where: { id: 'non-existent-section-id' },
			});

			expect(result).toEqual(null);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.where.mockResolvedValueOnce(new Error());

			const promise = sectionsRepository.findOne({
				where: { id: mockedSection.id },
			});

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('create', () => {
		it('should return created section', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([mockedDbSection]);

			const result = await sectionsRepository.create({
				name: mockedSection.name,
				description: null,
				order: mockedSection.order,
				learningPathId: mockedSection.learningPathId,
			});

			expect(result).toEqual(mockedSection);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce(new Error());

			const promise = sectionsRepository.create({
				name: mockedSection.name,
				description: null,
				order: mockedSection.order,
				learningPathId: mockedSection.learningPathId,
			});

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('update', () => {
		it('should return updated section', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([mockedDbSection]);

			const result = await sectionsRepository.update({
				where: { id: mockedSection.id },
			});

			expect(result).toEqual(mockedSection);
		});

		it('should return null', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([]);

			const result = await sectionsRepository.update({
				where: { id: 'non-existent-section-id' },
			});

			expect(result).toEqual(null);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce(new Error());

			const promise = sectionsRepository.update({
				where: { id: mockedSection.id },
			});

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('remove', () => {
		it('should return removed section', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([mockedDbSection]);

			const result = await sectionsRepository.remove({
				where: { id: mockedSection.id },
			});

			expect(result).toEqual(mockedSection);
		});

		it('should return null', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([]);

			const result = await sectionsRepository.remove({
				where: { id: 'non-existent-section-id' },
			});

			expect(result).toEqual(null);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce(new Error());

			const promise = sectionsRepository.remove({
				where: { id: mockedSection.id },
			});

			await expect(promise).rejects.toThrow(DbException);
		});

		it('should throw InvalidReferenceException', async () => {
			const pgErr = new PostgresError('', 0, 'error');
			pgErr.code = PG_FOREIGN_KEY_VIOLATION;

			const drizzleErr = new DrizzleQueryError('', [], pgErr);

			mockedDrizzle.returning.mockRejectedValueOnce(drizzleErr);

			const promise = sectionsRepository.remove({
				where: { id: mockedSection.id },
			});

			await expect(promise).rejects.toThrow(InvalidReferenceException);
		});
	});
});
