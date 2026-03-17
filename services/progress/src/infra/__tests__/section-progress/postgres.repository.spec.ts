import { SectionProgressId } from '@/domain/section-progress';
import { UUID } from '@/domain/common';
import { PostgresSectionProgressRepository } from '@/infra/section-progress/postgres.repository';
import { RepositoryException } from '@pathly-backend/common';
import {
	createDbServiceMock,
	createDeleteDbMock,
	createInsertDbMock,
	createSectionProgressAggregate,
	createSelectSingleDbMock,
} from '../common/db-test.utils';
import { INFRA_TEST_IDS } from '../common/test.utils';

describe('PostgresSectionProgressRepository', () => {
	describe('load', () => {
		it('returns aggregate when row exists', async () => {
			const { db } = createSelectSingleDbMock([
				{
					id: INFRA_TEST_IDS.sectionProgressId,
					sectionId: INFRA_TEST_IDS.sectionId,
					learningPathId: INFRA_TEST_IDS.learningPathId,
					userId: INFRA_TEST_IDS.userId,
					completedAt: null,
					completedUnitCount: 0,
					totalUnitCount: 3,
				},
			]);
			const repository = new PostgresSectionProgressRepository(
				createDbServiceMock(db),
			);

			const result = await repository.load(
				SectionProgressId.create(UUID.create(INFRA_TEST_IDS.sectionProgressId)),
			);

			expect(result?.id.toString()).toBe(INFRA_TEST_IDS.sectionProgressId);
		});

		it('returns null when missing', async () => {
			const { db } = createSelectSingleDbMock([]);
			const repository = new PostgresSectionProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.load(
					SectionProgressId.create(UUID.create(INFRA_TEST_IDS.sectionProgressId)),
				),
			).resolves.toBeNull();
		});
	});

	describe('save', () => {
		it('upserts aggregate', async () => {
			const { db, query } = createInsertDbMock();
			const repository = new PostgresSectionProgressRepository(
				createDbServiceMock(db),
			);

			await repository.save(createSectionProgressAggregate());

			expect(query.values).toHaveBeenCalledTimes(1);
			expect(query.onConflictDoUpdate).toHaveBeenCalledTimes(1);
		});

		it('wraps db errors in RepositoryException', async () => {
			const db = {
				insert: jest.fn(() => {
					throw new Error('db fail');
				}),
			};
			const repository = new PostgresSectionProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.save(createSectionProgressAggregate()),
			).rejects.toBeInstanceOf(RepositoryException);
		});
	});

	describe('remove', () => {
		it('returns boolean by deleted rows', async () => {
			const { db } = createDeleteDbMock([]);
			const repository = new PostgresSectionProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.remove(
					SectionProgressId.create(UUID.create(INFRA_TEST_IDS.sectionProgressId)),
				),
			).resolves.toBe(false);
		});

		it('returns true when rows were deleted', async () => {
			const { db } = createDeleteDbMock([{}]);
			const repository = new PostgresSectionProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.remove(
					SectionProgressId.create(UUID.create(INFRA_TEST_IDS.sectionProgressId)),
				),
			).resolves.toBe(true);
		});

		it('wraps db errors in RepositoryException', async () => {
			const db = {
				delete: jest.fn(() => {
					throw new Error('db fail');
				}),
			};
			const repository = new PostgresSectionProgressRepository(
				createDbServiceMock(db),
			);

			await expect(
				repository.remove(
					SectionProgressId.create(UUID.create(INFRA_TEST_IDS.sectionProgressId)),
				),
			).rejects.toBeInstanceOf(RepositoryException);
		});
	});
});
