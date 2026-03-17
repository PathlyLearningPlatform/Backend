import { PostgresLessonProgressReadRepository } from '@/infra/lesson-progress/postgres-read.repository';
import { RepositoryException } from '@pathly-backend/common';
import {
	createDbServiceMock,
	createSelectListDbMock,
	createSelectSingleDbMock,
} from '../common/db-test.utils';
import { INFRA_TEST_IDS } from '../common/test.utils';

describe('PostgresLessonProgressReadRepository', () => {
	describe('list', () => {
		it('returns rows from db', async () => {
			const rows = [
				{
					id: INFRA_TEST_IDS.lessonProgressId,
					lessonId: INFRA_TEST_IDS.lessonId,
					unitId: INFRA_TEST_IDS.unitId,
					userId: INFRA_TEST_IDS.userId,
					completedAt: null,
					completedActivityCount: 0,
					totalActivityCount: 3,
				},
			];
			const { db, query } = createSelectListDbMock(rows);
			const repository = new PostgresLessonProgressReadRepository(
				createDbServiceMock(db),
			);

			await expect(repository.list({})).resolves.toEqual(rows);
			expect(query.limit).toHaveBeenCalledWith(50);
		});

		it('wraps db errors in RepositoryException', async () => {
			const db = {
				select: jest.fn(() => {
					throw new Error('db fail');
				}),
			};
			const repository = new PostgresLessonProgressReadRepository(
				createDbServiceMock(db),
			);

			await expect(repository.list({})).rejects.toBeInstanceOf(
				RepositoryException,
			);
		});
	});

	describe('findById', () => {
		it('returns row when found', async () => {
			const row = {
				id: INFRA_TEST_IDS.lessonProgressId,
				lessonId: INFRA_TEST_IDS.lessonId,
				unitId: INFRA_TEST_IDS.unitId,
				userId: INFRA_TEST_IDS.userId,
				completedAt: null,
				completedActivityCount: 1,
				totalActivityCount: 3,
			};
			const { db } = createSelectSingleDbMock([row]);
			const repository = new PostgresLessonProgressReadRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.findById(INFRA_TEST_IDS.lessonProgressId),
			).resolves.toEqual(row);
		});

		it('returns null when missing', async () => {
			const { db } = createSelectSingleDbMock([]);
			const repository = new PostgresLessonProgressReadRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.findById(INFRA_TEST_IDS.lessonProgressId),
			).resolves.toBeNull();
		});
	});

	describe('findForUser', () => {
		it('returns row when found', async () => {
			const row = {
				id: INFRA_TEST_IDS.lessonProgressId,
				lessonId: INFRA_TEST_IDS.lessonId,
				unitId: INFRA_TEST_IDS.unitId,
				userId: INFRA_TEST_IDS.userId,
				completedAt: null,
				completedActivityCount: 1,
				totalActivityCount: 3,
			};
			const { db } = createSelectSingleDbMock([row]);
			const repository = new PostgresLessonProgressReadRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.findForUser(INFRA_TEST_IDS.lessonId, INFRA_TEST_IDS.userId),
			).resolves.toEqual(row);
		});

		it('returns null when missing', async () => {
			const { db } = createSelectSingleDbMock([]);
			const repository = new PostgresLessonProgressReadRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.findForUser(INFRA_TEST_IDS.lessonId, INFRA_TEST_IDS.userId),
			).resolves.toBeNull();
		});
	});
});
