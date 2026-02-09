import { Inject, Injectable } from '@nestjs/common';
import { RepositoryException } from '@pathly-backend/common/index.js';
import { and, eq } from 'drizzle-orm';
import type { IActivitiesRepository } from '@/app/activities/interfaces';
import type {
	Activity,
	ActivityQuery,
	Article,
	Exercise,
	Quiz,
} from '@/domain/activities/entities';
import { ActivityType } from '@/domain/activities/enums';
import type { Db } from '../common/types';
import { DbService } from '../db/db.service';
import {
	activitiesTable,
	articlesTable,
	exercisesTable,
	quizzesTable,
} from '../db/schemas';
import { ActivitiesApiConstraints } from './enums';
import {
	dbActivityToEntity,
	dbArticleToEntity,
	dbExerciseToEntity,
	dbQuizToEntity,
} from './helpers/db-to-entity.helper';

@Injectable()
export class PostgresActivitiesRepository implements IActivitiesRepository {
	private readonly db: Db;

	constructor(@Inject(DbService) dbService: DbService) {
		this.db = dbService.getDb();
	}

	async find(query?: ActivityQuery): Promise<Activity[]> {
		const limit =
			query?.options?.limit ?? ActivitiesApiConstraints.DEFAULT_LIMIT;
		const page = query?.options?.page ?? ActivitiesApiConstraints.DEFAULT_PAGE;
		const lessonId = query?.where?.lessonId;

		try {
			const result = await this.db
				.select()
				.from(activitiesTable)
				.where(
					and(lessonId ? eq(activitiesTable.lessonId, lessonId) : undefined),
				)
				.limit(limit)
				.offset(page);

			return result.map(dbActivityToEntity);
		} catch (err) {
			throw new RepositoryException('db query failed', err);
		}
	}

	async findOne(id: string): Promise<Activity | null> {
		try {
			const result = await this.db
				.select()
				.from(activitiesTable)
				.where(eq(activitiesTable.id, id));

			return result.length <= 0 ? null : dbActivityToEntity(result[0]);
		} catch (err) {
			throw new RepositoryException('db query failed', err);
		}
	}
	async findOneArticle(activityId: string): Promise<Article | null> {
		try {
			const result = await this.db
				.select()
				.from(activitiesTable)
				.innerJoin(
					articlesTable,
					eq(activitiesTable.id, articlesTable.activityId),
				)
				.where(
					and(
						eq(activitiesTable.id, activityId),
						eq(activitiesTable.type, ActivityType.ARTICLE),
					),
				);

			return result.length <= 0 ? null : dbArticleToEntity(result[0]);
		} catch (err) {
			throw new RepositoryException('db query failed', err);
		}
	}
	async findOneExercise(activityId: string): Promise<Exercise | null> {
		try {
			const result = await this.db
				.select()
				.from(activitiesTable)
				.innerJoin(
					exercisesTable,
					eq(activitiesTable.id, exercisesTable.activityId),
				)
				.where(
					and(
						eq(activitiesTable.id, activityId),
						eq(activitiesTable.type, ActivityType.EXERCISE),
					),
				);

			return result.length <= 0 ? null : dbExerciseToEntity(result[0]);
		} catch (err) {
			throw new RepositoryException('db query failed', err);
		}
	}
	async findOneQuiz(activityId: string): Promise<Quiz | null> {
		try {
			const result = await this.db
				.select()
				.from(activitiesTable)
				.innerJoin(
					quizzesTable,
					eq(activitiesTable.id, quizzesTable.activityId),
				)
				.where(
					and(
						eq(activitiesTable.id, activityId),
						eq(activitiesTable.type, ActivityType.QUIZ),
					),
				);

			return result.length <= 0 ? null : dbQuizToEntity(result[0]);
		} catch (err) {
			throw new RepositoryException('db query failed', err);
		}
	}

	async saveArticle(entity: Article): Promise<void> {
		try {
			await this.db.transaction(async (tx) => {
				await tx.insert(activitiesTable).values(entity).onConflictDoUpdate({
					target: activitiesTable.id,
					set: entity,
				});

				await tx
					.insert(articlesTable)
					.values({
						ref: entity.ref,
						activityId: entity.id,
					})
					.onConflictDoUpdate({
						target: articlesTable.activityId,
						set: {
							activityId: entity.id,
							ref: entity.ref,
						},
					});
			});
		} catch (err) {
			throw new RepositoryException('db query failed', err);
		}
	}
	async saveExercise(entity: Exercise): Promise<void> {
		try {
			await this.db.transaction(async (tx) => {
				await tx.insert(activitiesTable).values(entity).onConflictDoUpdate({
					target: activitiesTable.id,
					set: entity,
				});

				await tx
					.insert(exercisesTable)
					.values({
						difficulty: entity.difficulty,
						activityId: entity.id,
					})
					.onConflictDoUpdate({
						target: exercisesTable.activityId,
						set: {
							activityId: entity.id,
							difficulty: entity.difficulty,
						},
					});
			});
		} catch (err) {
			throw new RepositoryException('db query failed', err);
		}
	}
	async saveQuiz(entity: Quiz): Promise<void> {
		try {
			await this.db.transaction(async (tx) => {
				await tx.insert(activitiesTable).values(entity).onConflictDoUpdate({
					target: activitiesTable.id,
					set: entity,
				});

				await tx
					.insert(quizzesTable)
					.values({
						activityId: entity.id,
					})
					.onConflictDoUpdate({
						target: quizzesTable.activityId,
						set: {
							activityId: entity.id,
						},
					});
			});
		} catch (err) {
			throw new RepositoryException('db query failed', err);
		}
	}

	async remove(id: string): Promise<boolean> {
		try {
			const result = await this.db
				.delete(activitiesTable)
				.where(eq(activitiesTable.id, id))
				.returning();

			return result.length > 0;
		} catch (err) {
			throw new RepositoryException('db query failed', err);
		}
	}
}
