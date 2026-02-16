import { Inject, Injectable } from '@nestjs/common';
import {
	RepositoryException,
	UniqueConstraintException,
} from '@pathly-backend/core/index.js';
import { and, DrizzleQueryError, eq, notInArray, sql } from 'drizzle-orm';
import type { IActivitiesRepository } from '@/domain/activities/interfaces';
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
	questionsTable,
	quizzesTable,
} from '../db/schemas';
import { ActivitiesApiConstraints } from './enums';
import {
	dbActivityToEntity,
	dbArticleToEntity,
	dbExerciseToEntity,
	dbQuizToEntity,
} from './helpers/db-to-entity.helper';
import { PG_UNIQUE_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import { getColumnsFromUniqueConstraint } from '@pathly-backend/common/index.js';
import { DatabaseError as PostgresError } from 'pg';

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
			const result = await this.db.transaction(async (tx) => {
				const quizzes = await tx
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

				if (quizzes.length <= 0) {
					return null;
				}

				const quiz = quizzes[0];

				const questions = await tx
					.select()
					.from(questionsTable)
					.where(eq(questionsTable.quizId, quiz.quizzes.activityId));

				return dbQuizToEntity({
					activity: quiz.activities,
					questions: questions,
					quiz: quiz.quizzes,
				});
			});

			return result;
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
			if (err instanceof DrizzleQueryError) {
				if (err.cause instanceof PostgresError) {
					if (err.cause.code === PG_UNIQUE_VIOLATION) {
						throw new UniqueConstraintException(
							getColumnsFromUniqueConstraint(err.cause.constraint!),
						);
					}
				}
			}
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
			if (err instanceof DrizzleQueryError) {
				if (err.cause instanceof PostgresError) {
					if (err.cause.code === PG_UNIQUE_VIOLATION) {
						throw new UniqueConstraintException(
							getColumnsFromUniqueConstraint(err.cause.constraint!),
						);
					}
				}
			}
			throw new RepositoryException('db query failed', err);
		}
	}
	async saveQuiz(entity: Quiz): Promise<void> {
		try {
			await this.db.transaction(async (tx) => {
				await tx
					.insert(activitiesTable)
					.values(entity)
					.onConflictDoUpdate({
						target: activitiesTable.id,
						set: {
							createdAt: entity.createdAt,
							updatedAt: entity.updatedAt,
							description: entity.description,
							name: entity.name,
							order: entity.order,
							id: entity.id,
							lessonId: entity.lessonId,
							type: ActivityType.QUIZ,
						},
					});

				await tx
					.insert(quizzesTable)
					.values({
						activityId: entity.id,
						nextQuestionId: entity.nextQuestionId,
					})
					.onConflictDoUpdate({
						target: quizzesTable.activityId,
						set: {
							nextQuestionId: entity.nextQuestionId,
						},
					});

				const questionIds = entity.questions.map((q) => q.id);

				if (questionIds.length <= 0) {
					await tx
						.delete(questionsTable)
						.where(eq(questionsTable.quizId, entity.id));

					return;
				}

				await tx
					.delete(questionsTable)
					.where(
						and(
							eq(questionsTable.quizId, entity.id),
							notInArray(questionsTable.id, questionIds),
						),
					);

				await tx
					.insert(questionsTable)
					.values(
						entity.questions.map((q) => ({
							content: q.content,
							id: q.id,
							quizId: q.quizId,
							correctAnswer: q.correctAnswer,
						})),
					)
					.onConflictDoUpdate({
						target: [questionsTable.id, questionsTable.quizId],
						set: {
							content: sql.raw(`excluded.${questionsTable.content.name}`),
							correctAnswer: sql.raw(
								`excluded.${questionsTable.correctAnswer.name}`,
							),
						},
					});
			});
		} catch (err) {
			if (err instanceof DrizzleQueryError) {
				if (err.cause instanceof PostgresError) {
					if (err.cause.code === PG_UNIQUE_VIOLATION) {
						throw new UniqueConstraintException(
							getColumnsFromUniqueConstraint(err.cause.constraint!),
						);
					}
				}
			}
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
