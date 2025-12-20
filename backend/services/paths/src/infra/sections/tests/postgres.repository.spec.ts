import { Test } from '@nestjs/testing';
import { DbException } from '@pathly-backend/common/index.js';
import {
	mockedCreateCommand,
	mockedFindCommand,
	mockedFindOneCommand,
	mockedRemoveCommand,
	mockedUpdateCommand,
} from '@/app/sections/tests/mocks/commands.mock';
import { PostgresSectionsRepository } from '../postgres.repository';
import { mockedDb, mockedDbService } from './mocks/db.mock';
import { mockedDbSection, mockedSection } from './mocks/sections.mock';
import { SectionsApiConstraints } from '../enums';

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
			mockedDb.offset.mockResolvedValueOnce([mockedDbSection]);

			const result = await sectionsRepository.find(mockedFindCommand);

			expect(result).toEqual([mockedSection]);
			expect(result.length).toBeLessThanOrEqual(
				SectionsApiConstraints.DEFAULT_LIMIT,
			);
		});

		it('should throw DbException', async () => {
			mockedDb.offset.mockRejectedValueOnce(new Error());

			const promise = sectionsRepository.find(mockedFindCommand);

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('findOne', () => {
		it('should return a section', async () => {
			mockedDb.where.mockResolvedValueOnce([mockedDbSection]);

			const result = await sectionsRepository.findOne(mockedFindOneCommand);

			expect(result).toEqual(mockedSection);
		});

		it('should return null', async () => {
			mockedDb.where.mockResolvedValueOnce([]);

			const result = await sectionsRepository.findOne(mockedFindOneCommand);

			expect(result).toEqual(null);
		});

		it('should throw DbException', async () => {
			mockedDb.where.mockResolvedValueOnce(new Error());

			const promise = sectionsRepository.findOne(mockedFindOneCommand);

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('create', () => {
		it('should return created section', async () => {
			mockedDb.returning.mockResolvedValueOnce([mockedDbSection]);

			const result = await sectionsRepository.create(mockedCreateCommand);

			expect(result).toEqual(mockedSection);
		});

		it('should throw DbException', async () => {
			mockedDb.returning.mockResolvedValueOnce(new Error());

			const promise = sectionsRepository.create(mockedCreateCommand);

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('update', () => {
		it('should return updated section', async () => {
			mockedDb.returning.mockResolvedValueOnce([mockedDbSection]);

			const result = await sectionsRepository.update(mockedUpdateCommand);

			expect(result).toEqual(mockedSection);
		});

		it('should return null', async () => {
			mockedDb.returning.mockResolvedValueOnce([]);

			const result = await sectionsRepository.update(mockedUpdateCommand);

			expect(result).toEqual(null);
		});

		it('should throw DbException', async () => {
			mockedDb.returning.mockResolvedValueOnce(new Error());

			const promise = sectionsRepository.update(mockedUpdateCommand);

			await expect(promise).rejects.toThrow(DbException);
		});
	});

	describe('remove', () => {
		it('should return removed section', async () => {
			mockedDb.returning.mockResolvedValueOnce([mockedDbSection]);

			const result = await sectionsRepository.remove(mockedRemoveCommand);

			expect(result).toEqual(mockedSection);
		});

		it('should return null', async () => {
			mockedDb.returning.mockResolvedValueOnce([]);

			const result = await sectionsRepository.remove(mockedRemoveCommand);

			expect(result).toEqual(null);
		});

		it('should throw DbException', async () => {
			mockedDb.returning.mockResolvedValueOnce(new Error());

			const promise = sectionsRepository.remove(mockedRemoveCommand);

			await expect(promise).rejects.toThrow(DbException);
		});
	});
});
