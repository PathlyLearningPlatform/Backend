import { PG_FOREIGN_KEY_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import { Test } from '@nestjs/testing';
import {
	DbException,
	InvalidReferenceException,
} from '@pathly-backend/common/index.js';
import { DrizzleQueryError } from 'drizzle-orm';
import { DatabaseError as PostgresError } from 'pg';
import { mockedLesson } from '@/app/common/mocks';
import { mockedDbService, mockedDrizzle } from '@/infra/common/mocks';
import { LessonsApiConstraints } from '../enums';
import { PostgresLessonsRepository } from '../postgres.repository';
import { mockedDbLesson } from './mocks/lessons.mock';

describe('LessonsRepository', () => {
	let lessonsRepository: PostgresLessonsRepository;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [mockedDbService, PostgresLessonsRepository],
		}).compile();

		lessonsRepository = moduleRef.get(PostgresLessonsRepository);
	});

	describe('find', () => {
		it('should return an array of lessons', async () => {
			mockedDrizzle.offset.mockResolvedValueOnce([mockedDbLesson]);

			const result = await lessonsRepository.find({});

			expect(result).toEqual([mockedLesson]);
			expect(result.length).toBeLessThanOrEqual(
				LessonsApiConstraints.DEFAULT_LIMIT,
			);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.offset.mockRejectedValueOnce(new Error());

			const promise = lessonsRepository.find({});

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('findOne', () => {
		it('should return a lesson', async () => {
			mockedDrizzle.where.mockResolvedValueOnce([mockedDbLesson]);

			const result = await lessonsRepository.findOne({
				where: { id: mockedLesson.id },
			});

			expect(result).toEqual(mockedLesson);
		});

		it('should return null', async () => {
			mockedDrizzle.where.mockResolvedValueOnce([]);

			const result = await lessonsRepository.findOne({
				where: { id: 'non-existent-lesson-id' },
			});

			expect(result).toEqual(null);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.where.mockResolvedValueOnce(new Error());

			const promise = lessonsRepository.findOne({
				where: { id: mockedLesson.id },
			});

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('create', () => {
		it('should return created lesson', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([mockedDbLesson]);

			const result = await lessonsRepository.create({
				name: mockedLesson.name,
				description: null,
				order: mockedLesson.order,
				unitId: mockedLesson.unitId,
			});

			expect(result).toEqual(mockedLesson);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce(new Error());

			const promise = lessonsRepository.create({
				name: mockedLesson.name,
				description: null,
				order: mockedLesson.order,
				unitId: mockedLesson.unitId,
			});

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('update', () => {
		it('should return updated lesson', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([mockedDbLesson]);

			const result = await lessonsRepository.update({
				where: { id: mockedLesson.id },
			});

			expect(result).toEqual(mockedLesson);
		});

		it('should return null', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([]);

			const result = await lessonsRepository.update({
				where: { id: 'non-existent-lesson-id' },
			});

			expect(result).toEqual(null);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce(new Error());

			const promise = lessonsRepository.update({
				where: { id: mockedLesson.id },
			});

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('remove', () => {
		it('should return removed lesson', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([mockedDbLesson]);

			const result = await lessonsRepository.remove({
				where: { id: mockedLesson.id },
			});

			expect(result).toEqual(mockedLesson);
		});

		it('should return null', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce([]);

			const result = await lessonsRepository.remove({
				where: { id: 'non-existent-lesson-id' },
			});

			expect(result).toEqual(null);
		});

		it('should throw DbException', async () => {
			mockedDrizzle.returning.mockResolvedValueOnce(new Error());

			const promise = lessonsRepository.remove({
				where: { id: mockedLesson.id },
			});

			await expect(promise).rejects.toThrow(DbException);
		});

		it('should throw InvalidReferenceException', async () => {
			const pgErr = new PostgresError('', 0, 'error');
			pgErr.code = PG_FOREIGN_KEY_VIOLATION;

			const drizzleErr = new DrizzleQueryError('', [], pgErr);

			mockedDrizzle.returning.mockRejectedValueOnce(drizzleErr);

			const promise = lessonsRepository.remove({
				where: { id: mockedLesson.id },
			});

			await expect(promise).rejects.toThrow(InvalidReferenceException);
		});
	});
});
