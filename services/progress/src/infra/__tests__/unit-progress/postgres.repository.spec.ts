import { UnitProgressId } from '@/domain/unit-progress';
import { UUID } from '@/domain/common';
import { PostgresUnitProgressRepository } from '@/infra/unit-progress/postgres.repository';
import { RepositoryException } from '@pathly-backend/common';
import {
	createDbServiceMock,
	createDeleteDbMock,
	createInsertDbMock,
	createSelectSingleDbMock,
	createUnitProgressAggregate,
} from '../common/db-test.utils';
import { INFRA_TEST_IDS } from '../common/test.utils';

describe('PostgresUnitProgressRepository', () => {
	describe('load', () => {
		it('returns aggregate when row exists', async () => {
			const { db } = createSelectSingleDbMock([
				{
					id: INFRA_TEST_IDS.unitProgressId,
					unitId: INFRA_TEST_IDS.unitId,
					sectionId: INFRA_TEST_IDS.sectionId,
					userId: INFRA_TEST_IDS.userId,
					completedAt: null,
					completedLessonCount: 0,
					totalLessonCount: 3,
				},
			]);
			const repository = new PostgresUnitProgressRepository(
				createDbServiceMock(db),
			);

			const result = await repository.load(
				UnitProgressId.create(UUID.create(INFRA_TEST_IDS.unitProgressId)),
			);

			expect(result?.id.toString()).toBe(INFRA_TEST_IDS.unitProgressId);
		});

		it('returns null when missing', async () => {
			const { db } = createSelectSingleDbMock([]);
			const repository = new PostgresUnitProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.load(
					UnitProgressId.create(UUID.create(INFRA_TEST_IDS.unitProgressId)),
				),
			).resolves.toBeNull();
		});
	});

	describe('save', () => {
		it('upserts aggregate', async () => {
			const { db, query } = createInsertDbMock();
			const repository = new PostgresUnitProgressRepository(
				createDbServiceMock(db),
			);

			await repository.save(createUnitProgressAggregate());

			expect(query.values).toHaveBeenCalledTimes(1);
			expect(query.onConflictDoUpdate).toHaveBeenCalledTimes(1);
		});

		it('wraps db errors in RepositoryException', async () => {
			const db = {
				insert: jest.fn(() => {
					throw new Error('db fail');
				}),
			};
			const repository = new PostgresUnitProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.save(createUnitProgressAggregate()),
			).rejects.toBeInstanceOf(RepositoryException);
		});
	});

	describe('remove', () => {
		it('returns boolean by deleted rows', async () => {
			const { db } = createDeleteDbMock([{}]);
			const repository = new PostgresUnitProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.remove(
					UnitProgressId.create(UUID.create(INFRA_TEST_IDS.unitProgressId)),
				),
			).resolves.toBe(true);
		});

		it('returns false when rows were not deleted', async () => {
			const { db } = createDeleteDbMock([]);
			const repository = new PostgresUnitProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.remove(
					UnitProgressId.create(UUID.create(INFRA_TEST_IDS.unitProgressId)),
				),
			).resolves.toBe(false);
		});

		it('wraps db errors in RepositoryException', async () => {
			const db = {
				delete: jest.fn(() => {
					throw new Error('db fail');
				}),
			};
			const repository = new PostgresUnitProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.remove(
					UnitProgressId.create(UUID.create(INFRA_TEST_IDS.unitProgressId)),
				),
			).rejects.toBeInstanceOf(RepositoryException);
		});
	});
});
