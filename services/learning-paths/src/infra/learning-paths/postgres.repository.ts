import { Inject, Injectable } from '@nestjs/common';
import type { ILearningPathRepository } from '@/domain/learning-paths/interfaces';
import type { Db } from '@/infra/common/types';
import { DbService } from '@infra/common/db/db.service';
import { LearningPath } from '@/domain/learning-paths/learning-path.aggregate';
import {
	LearningPathDescription,
	LearningPathId,
	LearningPathName,
	SectionRef,
} from '@/domain/learning-paths/value-objects';
import { learningPathsTable, sectionsTable } from '../common/db/schemas';
import { RepositoryException } from '@pathly-backend/common/index.js';
import { eq } from 'drizzle-orm';
import { SectionId } from '@/domain/sections/value-objects';
import { Order } from '@/domain/common';

@Injectable()
export class PostgresLearningPathRepository implements ILearningPathRepository {
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	async load(id: LearningPathId): Promise<LearningPath | null> {
		const rawId = id.value;

		try {
			const result = await this.db.transaction(async (tx) => {
				const [dbLearningPath] = await tx
					.select()
					.from(learningPathsTable)
					.where(eq(learningPathsTable.id, rawId));

				if (!dbLearningPath) {
					return null;
				}

				const sectionRefs = await tx
					.select({ order: sectionsTable.order, sectionId: sectionsTable.id })
					.from(sectionsTable)
					.where(eq(sectionsTable.learningPathId, rawId));

				const learningPath = LearningPath.fromDataSource(id, {
					name: LearningPathName.create(dbLearningPath.name),
					description: dbLearningPath.description
						? LearningPathDescription.create(dbLearningPath.description)
						: null,
					createdAt: dbLearningPath.createdAt,
					updatedAt: dbLearningPath.updatedAt,
					sectionCount: dbLearningPath.sectionCount,
					sectionRefs: sectionRefs.map((ref) =>
						SectionRef.create({
							order: Order.create(ref.order),
							sectionId: SectionId.create(ref.sectionId),
						}),
					),
				});

				return learningPath;
			});

			return result;
		} catch (err) {
			throw new RepositoryException('postgres exception', err);
		}
	}

	async remove(id: LearningPathId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(learningPathsTable)
				.where(eq(learningPathsTable.id, id.value));

			return result.rows.length > 0;
		} catch (err) {
			throw new RepositoryException('postgres exception', err);
		}
	}

	async save(aggregate: LearningPath): Promise<void> {
		try {
			await this.db
				.insert(learningPathsTable)
				.values({
					id: aggregate.id.value,
					name: aggregate.name.value,
					description: aggregate.description?.value ?? null,
					createdAt: aggregate.createdAt,
					updatedAt: aggregate.updatedAt,
					sectionCount: aggregate.sectionCount,
				})
				.onConflictDoUpdate({
					target: learningPathsTable.id,
					set: {
						name: aggregate.name.value,
						description: aggregate.description?.value ?? null,
						updatedAt: aggregate.updatedAt,
						sectionCount: aggregate.sectionCount,
					},
				});
		} catch (err) {
			throw new RepositoryException('postgres exception', err);
		}
	}
}
