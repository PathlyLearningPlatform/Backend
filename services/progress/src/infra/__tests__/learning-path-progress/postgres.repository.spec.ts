import { LearningPathProgressId } from '@/domain/learning-path-progress';
import { UUID } from '@/domain/common';
import { PostgresLearningPathProgressRepository } from '@/infra/learning-path-progress/postgres.repository';
import { RepositoryException } from '@pathly-backend/common';
import {
	createDbServiceMock,
	createDeleteDbMock,
	createInsertDbMock,
	createLearningPathProgressAggregate,
	createSelectSingleDbMock,
} from '../common/db-test.utils';
import { INFRA_TEST_IDS } from '../common/test.utils';

describe('PostgresLearningPathProgressRepository', () => {
	describe('load', () => {
		it('returns aggregate when row exists', async () => {
			const { db } = createSelectSingleDbMock([
				{
					id: INFRA_TEST_IDS.learningPathProgressId,
					learningPathId: INFRA_TEST_IDS.learningPathId,
					userId: INFRA_TEST_IDS.userId,
					completedAt: null,
					completedSectionCount: 0,
					totalSectionCount: 3,
				},
			]);
			const repository = new PostgresLearningPathProgressRepository(
				createDbServiceMock(db),
			);

			const result = await repository.load(
				LearningPathProgressId.create(
					UUID.create(INFRA_TEST_IDS.learningPathProgressId),
				),
			);

			expect(result?.id.toString()).toBe(INFRA_TEST_IDS.learningPathProgressId);
		});

		it('returns null when missing', async () => {
			const { db } = createSelectSingleDbMock([]);
			const repository = new PostgresLearningPathProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.load(
					LearningPathProgressId.create(
						UUID.create(INFRA_TEST_IDS.learningPathProgressId),
					),
				),
			).resolves.toBeNull();
		});
	});

	describe('save', () => {
		it('upserts aggregate', async () => {
			const { db, query } = createInsertDbMock();
			const repository = new PostgresLearningPathProgressRepository(
				createDbServiceMock(db),
			);

			await repository.save(createLearningPathProgressAggregate());

			expect(query.values).toHaveBeenCalledTimes(1);
			expect(query.onConflictDoUpdate).toHaveBeenCalledTimes(1);
		});

		it('wraps db errors in RepositoryException', async () => {
			const db = {
				insert: jest.fn(() => {
					throw new Error('db fail');
				}),
			};
			const repository = new PostgresLearningPathProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.save(createLearningPathProgressAggregate()),
			).rejects.toBeInstanceOf(RepositoryException);
		});
	});

	describe('remove', () => {
		it('returns boolean by deleted rows', async () => {
			const { db } = createDeleteDbMock([{}]);
			const repository = new PostgresLearningPathProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.remove(
					LearningPathProgressId.create(
						UUID.create(INFRA_TEST_IDS.learningPathProgressId),
					),
				),
			).resolves.toBe(true);
		});

		it('returns false when rows were not deleted', async () => {
			const { db } = createDeleteDbMock([]);
			const repository = new PostgresLearningPathProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.remove(
					LearningPathProgressId.create(
						UUID.create(INFRA_TEST_IDS.learningPathProgressId),
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
			const repository = new PostgresLearningPathProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.remove(
					LearningPathProgressId.create(
						UUID.create(INFRA_TEST_IDS.learningPathProgressId),
					),
				),
			).rejects.toBeInstanceOf(RepositoryException);
		});
	});
});
