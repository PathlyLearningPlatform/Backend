import { LessonProgressId } from '@/domain/lesson-progress';
import { UUID } from '@/domain/common';
import { PostgresLessonProgressRepository } from '@/infra/lesson-progress/postgres.repository';
import { RepositoryException } from '@pathly-backend/common';
import {
	createDbServiceMock,
	createDeleteDbMock,
	createInsertDbMock,
	createLessonProgressAggregate,
	createSelectSingleDbMock,
} from '../common/db-test.utils';
import { INFRA_TEST_IDS } from '../common/test.utils';

describe('PostgresLessonProgressRepository', () => {
	describe('load', () => {
		it('returns aggregate when row exists', async () => {
			const { db } = createSelectSingleDbMock([
				{
					id: INFRA_TEST_IDS.lessonProgressId,
					lessonId: INFRA_TEST_IDS.lessonId,
					unitId: INFRA_TEST_IDS.unitId,
					userId: INFRA_TEST_IDS.userId,
					completedAt: null,
					completedActivityCount: 0,
					totalActivityCount: 3,
				},
			]);
			const repository = new PostgresLessonProgressRepository(
				createDbServiceMock(db),
			);

			const result = await repository.load(
				LessonProgressId.create(UUID.create(INFRA_TEST_IDS.lessonProgressId)),
			);

			expect(result?.id.toString()).toBe(INFRA_TEST_IDS.lessonProgressId);
		});

		it('returns null when missing', async () => {
			const { db } = createSelectSingleDbMock([]);
			const repository = new PostgresLessonProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.load(
					LessonProgressId.create(UUID.create(INFRA_TEST_IDS.lessonProgressId)),
				),
			).resolves.toBeNull();
		});
	});

	describe('save', () => {
		it('upserts aggregate', async () => {
			const { db, query } = createInsertDbMock();
			const repository = new PostgresLessonProgressRepository(
				createDbServiceMock(db),
			);

			await repository.save(createLessonProgressAggregate());

			expect(query.values).toHaveBeenCalledTimes(1);
			expect(query.onConflictDoUpdate).toHaveBeenCalledTimes(1);
		});

		it('wraps db errors in RepositoryException', async () => {
			const db = {
				insert: jest.fn(() => {
					throw new Error('db fail');
				}),
			};
			const repository = new PostgresLessonProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.save(createLessonProgressAggregate()),
			).rejects.toBeInstanceOf(RepositoryException);
		});
	});

	describe('remove', () => {
		it('returns false when no rows', async () => {
			const { db } = createDeleteDbMock([]);
			const repository = new PostgresLessonProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.remove(
					LessonProgressId.create(UUID.create(INFRA_TEST_IDS.lessonProgressId)),
				),
			).resolves.toBe(false);
		});

		it('returns true when rows were deleted', async () => {
			const { db } = createDeleteDbMock([{}]);
			const repository = new PostgresLessonProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.remove(
					LessonProgressId.create(UUID.create(INFRA_TEST_IDS.lessonProgressId)),
				),
			).resolves.toBe(true);
		});

		it('wraps db errors in RepositoryException', async () => {
			const db = {
				delete: jest.fn(() => {
					throw new Error('db fail');
				}),
			};
			const repository = new PostgresLessonProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.remove(
					LessonProgressId.create(UUID.create(INFRA_TEST_IDS.lessonProgressId)),
				),
			).rejects.toBeInstanceOf(RepositoryException);
		});
	});
});
