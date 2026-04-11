import { DbService } from '@/infra/db/db.service';
import { Inject, Injectable } from '@nestjs/common';
import { RepositoryException } from '@infra/common';
import { eq } from 'drizzle-orm';
import { Order } from '@/domain/common';
import type { ILearningPathRepository } from '@/domain/learning-paths';
import { LearningPath } from '@/domain/learning-paths/learning-path.aggregate';
import {
	LearningPathDescription,
	type LearningPathId,
	LearningPathName,
	SectionRef,
} from '@/domain/learning-paths/value-objects';
import { SectionId } from '@/domain/sections/value-objects';
import type { Db } from '@/infra/db/type';
import { learningPathsTable, sectionsTable } from '../db/schemas';

@Injectable()
export class PostgresLearningPathRepository implements ILearningPathRepository {
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	async load(id: LearningPathId): Promise<LearningPath | null> {
		const rawId = id.toString();

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
				.where(eq(learningPathsTable.id, id.toString()));

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
					id: aggregate.id.toString(),
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
