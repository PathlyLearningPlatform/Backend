import { ActivityProgressId } from '@/domain/activity-progress';
import { UUID } from '@/domain/common';
import { PostgresActivityProgressRepository } from '@/infra/activity-progress/postgres.repository';
import { RepositoryException } from '@pathly-backend/common';
import {
	createActivityProgressAggregate,
	createDbServiceMock,
	createDeleteDbMock,
	createInsertDbMock,
	createSelectSingleDbMock,
} from '../common/db-test.utils';
import { INFRA_TEST_IDS } from '../common/test.utils';

describe('PostgresActivityProgressRepository', () => {
	describe('load', () => {
		it('returns aggregate when row exists', async () => {
			const { db } = createSelectSingleDbMock([
				{
					id: INFRA_TEST_IDS.activityProgressId,
					activityId: INFRA_TEST_IDS.activityId,
					lessonId: INFRA_TEST_IDS.lessonId,
					userId: INFRA_TEST_IDS.userId,
					completedAt: null,
				},
			]);
			const repository = new PostgresActivityProgressRepository(
				createDbServiceMock(db),
			);

			const result = await repository.load(
				ActivityProgressId.create(UUID.create(INFRA_TEST_IDS.activityProgressId)),
			);

			expect(result?.id.toString()).toBe(INFRA_TEST_IDS.activityProgressId);
		});

		it('returns null when row does not exist', async () => {
			const { db } = createSelectSingleDbMock([]);
			const repository = new PostgresActivityProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.load(
					ActivityProgressId.create(
						UUID.create(INFRA_TEST_IDS.activityProgressId),
					),
				),
			).resolves.toBeNull();
		});

		it('wraps db errors in RepositoryException', async () => {
			const db = {
				select: jest.fn(() => {
					throw new Error('db fail');
				}),
			};
			const repository = new PostgresActivityProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.load(
					ActivityProgressId.create(
						UUID.create(INFRA_TEST_IDS.activityProgressId),
					),
				),
			).rejects.toBeInstanceOf(RepositoryException);
		});
	});

	describe('save', () => {
		it('upserts aggregate', async () => {
			const { db, query } = createInsertDbMock();
			const repository = new PostgresActivityProgressRepository(
				createDbServiceMock(db),
			);

			await repository.save(createActivityProgressAggregate());

			expect(db.insert).toHaveBeenCalledTimes(1);
			expect(query.values).toHaveBeenCalledTimes(1);
			expect(query.onConflictDoUpdate).toHaveBeenCalledTimes(1);
		});

		it('wraps db errors in RepositoryException', async () => {
			const db = {
				insert: jest.fn(() => {
					throw new Error('db fail');
				}),
			};
			const repository = new PostgresActivityProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.save(createActivityProgressAggregate()),
			).rejects.toBeInstanceOf(RepositoryException);
		});
	});

	describe('remove', () => {
		it('returns true when rows were deleted', async () => {
			const { db } = createDeleteDbMock([{}]);
			const repository = new PostgresActivityProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.remove(
					ActivityProgressId.create(
						UUID.create(INFRA_TEST_IDS.activityProgressId),
					),
				),
			).resolves.toBe(true);
		});

		it('returns false when rows were not deleted', async () => {
			const { db } = createDeleteDbMock([]);
			const repository = new PostgresActivityProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.remove(
					ActivityProgressId.create(
						UUID.create(INFRA_TEST_IDS.activityProgressId),
					),
				),
			).resolves.toBe(false);
		});

		it('wraps db errors in RepositoryException', async () => {
			const db = {
				delete: jest.fn(() => {
					throw new Error('db fail');
				}),
			};
			const repository = new PostgresActivityProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.remove(
					ActivityProgressId.create(
						UUID.create(INFRA_TEST_IDS.activityProgressId),
					),
				),
			).rejects.toBeInstanceOf(RepositoryException);
		});
	});
});
