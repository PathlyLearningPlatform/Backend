import { PostgresLearningPathProgressReadRepository } from '@/infra/learning-path-progress/postgres-read.repository';
import { RepositoryException } from '@pathly-backend/common';
import {
	createDbServiceMock,
	createSelectListDbMock,
	createSelectSingleDbMock,
} from '../common/db-test.utils';
import { INFRA_TEST_IDS } from '../common/test.utils';

describe('PostgresLearningPathProgressReadRepository', () => {
	describe('list', () => {
		it('returns rows from db', async () => {
			const rows = [
				{
					id: INFRA_TEST_IDS.learningPathProgressId,
					learningPathId: INFRA_TEST_IDS.learningPathId,
					userId: INFRA_TEST_IDS.userId,
					completedAt: null,
					completedSectionCount: 0,
					totalSectionCount: 3,
				},
			];
			const { db, query } = createSelectListDbMock(rows);
			const repository = new PostgresLearningPathProgressReadRepository(
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
			const repository = new PostgresLearningPathProgressReadRepository(
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
				id: INFRA_TEST_IDS.learningPathProgressId,
				learningPathId: INFRA_TEST_IDS.learningPathId,
				userId: INFRA_TEST_IDS.userId,
				completedAt: null,
				completedSectionCount: 1,
				totalSectionCount: 3,
			};
			const { db } = createSelectSingleDbMock([row]);
			const repository = new PostgresLearningPathProgressReadRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.findById(INFRA_TEST_IDS.learningPathProgressId),
			).resolves.toEqual(row);
		});

		it('returns null when missing', async () => {
			const { db } = createSelectSingleDbMock([]);
			const repository = new PostgresLearningPathProgressReadRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.findById(INFRA_TEST_IDS.learningPathProgressId),
			).resolves.toBeNull();
		});
	});

	describe('findForUser', () => {
		it('returns row when found', async () => {
			const row = {
				id: INFRA_TEST_IDS.learningPathProgressId,
				learningPathId: INFRA_TEST_IDS.learningPathId,
				userId: INFRA_TEST_IDS.userId,
				completedAt: null,
				completedSectionCount: 1,
				totalSectionCount: 3,
			};
			const { db } = createSelectSingleDbMock([row]);
			const repository = new PostgresLearningPathProgressReadRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.findForUser(INFRA_TEST_IDS.learningPathId, INFRA_TEST_IDS.userId),
			).resolves.toEqual(row);
		});

		it('returns null when missing', async () => {
			const { db } = createSelectSingleDbMock([]);
			const repository = new PostgresLearningPathProgressReadRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.findForUser(INFRA_TEST_IDS.learningPathId, INFRA_TEST_IDS.userId),
			).resolves.toBeNull();
		});
	});
});
