import { PostgresSectionProgressReadRepository } from '@/infra/section-progress/postgres-read.repository';
import { RepositoryException } from '@pathly-backend/common';
import {
	createDbServiceMock,
	createSelectListDbMock,
	createSelectSingleDbMock,
} from '../common/db-test.utils';
import { INFRA_TEST_IDS } from '../common/test.utils';

describe('PostgresSectionProgressReadRepository', () => {
	describe('list', () => {
		it('returns rows from db', async () => {
			const rows = [
				{
					id: INFRA_TEST_IDS.sectionProgressId,
					sectionId: INFRA_TEST_IDS.sectionId,
					learningPathId: INFRA_TEST_IDS.learningPathId,
					userId: INFRA_TEST_IDS.userId,
					completedAt: null,
					completedUnitCount: 0,
					totalUnitCount: 3,
				},
			];
			const { db, query } = createSelectListDbMock(rows);
			const repository = new PostgresSectionProgressReadRepository(
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
			const repository = new PostgresSectionProgressReadRepository(
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
				id: INFRA_TEST_IDS.sectionProgressId,
				sectionId: INFRA_TEST_IDS.sectionId,
				learningPathId: INFRA_TEST_IDS.learningPathId,
				userId: INFRA_TEST_IDS.userId,
				completedAt: null,
				completedUnitCount: 1,
				totalUnitCount: 3,
			};
			const { db } = createSelectSingleDbMock([row]);
			const repository = new PostgresSectionProgressReadRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.findById(INFRA_TEST_IDS.sectionProgressId),
			).resolves.toEqual(row);
		});

		it('returns null when missing', async () => {
			const { db } = createSelectSingleDbMock([]);
			const repository = new PostgresSectionProgressReadRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.findById(INFRA_TEST_IDS.sectionProgressId),
			).resolves.toBeNull();
		});
	});

	describe('findForUser', () => {
		it('returns row when found', async () => {
			const row = {
				id: INFRA_TEST_IDS.sectionProgressId,
				sectionId: INFRA_TEST_IDS.sectionId,
				learningPathId: INFRA_TEST_IDS.learningPathId,
				userId: INFRA_TEST_IDS.userId,
				completedAt: null,
				completedUnitCount: 1,
				totalUnitCount: 3,
			};
			const { db } = createSelectSingleDbMock([row]);
			const repository = new PostgresSectionProgressReadRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.findForUser(INFRA_TEST_IDS.sectionId, INFRA_TEST_IDS.userId),
			).resolves.toEqual(row);
		});

		it('returns null when missing', async () => {
			const { db } = createSelectSingleDbMock([]);
			const repository = new PostgresSectionProgressReadRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.findForUser(INFRA_TEST_IDS.sectionId, INFRA_TEST_IDS.userId),
			).resolves.toBeNull();
		});
	});
});
