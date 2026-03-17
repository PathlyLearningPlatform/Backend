import { PostgresActivityProgressReadRepository } from '@/infra/activity-progress/postgres-read.repository';
import { RepositoryException } from '@pathly-backend/common';
import {
	createDbServiceMock,
	createSelectListDbMock,
	createSelectSingleDbMock,
} from '../common/db-test.utils';
import { INFRA_TEST_IDS } from '../common/test.utils';

describe('PostgresActivityProgressReadRepository', () => {
	describe('list', () => {
		it('returns rows from db', async () => {
			const rows = [
				{
					id: INFRA_TEST_IDS.activityProgressId,
					activityId: INFRA_TEST_IDS.activityId,
					lessonId: INFRA_TEST_IDS.lessonId,
					userId: INFRA_TEST_IDS.userId,
					completedAt: null,
				},
			];
			const { db, query } = createSelectListDbMock(rows);
			const repository = new PostgresActivityProgressReadRepository(
				createDbServiceMock(db),
			);

			await expect(repository.list({})).resolves.toEqual(rows);
			expect(query.limit).toHaveBeenCalledWith(50);
			expect(query.offset).toHaveBeenCalledWith(0);
		});

		it('wraps db errors in RepositoryException', async () => {
			const db = {
				select: jest.fn(() => {
					throw new Error('db fail');
				}),
			};
			const repository = new PostgresActivityProgressReadRepository(
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
				id: INFRA_TEST_IDS.activityProgressId,
				activityId: INFRA_TEST_IDS.activityId,
				lessonId: INFRA_TEST_IDS.lessonId,
				userId: INFRA_TEST_IDS.userId,
				completedAt: null,
			};
			const { db } = createSelectSingleDbMock([row]);
			const repository = new PostgresActivityProgressReadRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.findById(INFRA_TEST_IDS.activityProgressId),
			).resolves.toEqual(row);
		});

		it('returns null when missing', async () => {
			const { db } = createSelectSingleDbMock([]);
			const repository = new PostgresActivityProgressReadRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.findById(INFRA_TEST_IDS.activityProgressId),
			).resolves.toBeNull();
		});
	});

	describe('findForUser', () => {
		it('returns row when found', async () => {
			const row = {
				id: INFRA_TEST_IDS.activityProgressId,
				activityId: INFRA_TEST_IDS.activityId,
				lessonId: INFRA_TEST_IDS.lessonId,
				userId: INFRA_TEST_IDS.userId,
				completedAt: null,
			};
			const { db } = createSelectSingleDbMock([row]);
			const repository = new PostgresActivityProgressReadRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.findForUser(INFRA_TEST_IDS.activityId, INFRA_TEST_IDS.userId),
			).resolves.toEqual(row);
		});

		it('returns null when missing', async () => {
			const { db } = createSelectSingleDbMock([]);
			const repository = new PostgresActivityProgressReadRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.findForUser(INFRA_TEST_IDS.activityId, INFRA_TEST_IDS.userId),
			).resolves.toBeNull();
		});
	});
});
