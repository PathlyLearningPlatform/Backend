import { DbService } from '@/infra/db/db.service';
import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@infra/common';
import { eq } from 'drizzle-orm';
import { Lesson } from '@/domain/lessons/lesson.aggregate';
import type { ILessonRepository } from '@/domain/lessons/repositories';
import { ActivityRef } from '@/domain/lessons/value-objects';
import type { LessonId } from '@/domain/lessons/value-objects/id.vo';
import type { Db } from '@/infra/db/type';
import { activitiesTable, lessonsTable } from '../db/schemas';

@Injectable()
export class PostgresLessonRepository implements ILessonRepository {
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	async load(id: LessonId): Promise<Lesson | null> {
		const rawId = id.value;

		try {
			const result = await this.db.transaction(async (tx) => {
				const [dbLesson] = await tx
					.select()
					.from(lessonsTable)
					.where(eq(lessonsTable.id, rawId));

				if (!dbLesson) {
					return null;
				}

				const activityRefs = await tx
					.select({
						order: activitiesTable.order,
						activityId: activitiesTable.id,
					})
					.from(activitiesTable)
					.where(eq(activitiesTable.lessonId, rawId));

				const lesson = Lesson.fromDataSource({
					id: dbLesson.id,
					unitId: dbLesson.unitId,
					name: dbLesson.name,
					description: dbLesson.description,
					createdAt: dbLesson.createdAt,
					updatedAt: dbLesson.updatedAt,
					order: dbLesson.order,
					activityCount: dbLesson.activityCount,
					activityRefs: activityRefs.map((ref) =>
						ActivityRef.create({
							order: ref.order,
							activityId: ref.activityId,
						}),
					),
				});

				return lesson;
			});

			return result;
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async remove(id: LessonId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(lessonsTable)
				.where(eq(lessonsTable.id, id.value));

			return result.rows.length > 0;
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async save(aggregate: Lesson): Promise<void> {
		try {
			await this.db
				.insert(lessonsTable)
				.values({
					id: aggregate.id.value,
					unitId: aggregate.unitId.value,
					name: aggregate.name.value,
					description: aggregate.description?.value ?? null,
					order: aggregate.order.value,
					createdAt: aggregate.createdAt,
					updatedAt: aggregate.updatedAt,
					activityCount: aggregate.activityCount,
				})
				.onConflictDoUpdate({
					target: lessonsTable.id,
					set: {
						name: aggregate.name.value,
						description: aggregate.description?.value ?? null,
						order: aggregate.order.value,
						updatedAt: aggregate.updatedAt,
						activityCount: aggregate.activityCount,
					},
				});
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}
}
