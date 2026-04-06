import { DbService } from '@infra/common/db/db.service';
import { Inject, Injectable } from '@nestjs/common';
import { RepositoryException } from '@pathly-backend/common/index.js';
import { eq } from 'drizzle-orm';
import type { Activity } from '@/domain/activities/activity.aggregate';
import { Article } from '@/domain/activities/articles/article.aggregate';
import { Exercise } from '@/domain/activities/exercises/exercise.aggregate';
import { Question } from '@/domain/activities/quizzes/question.entity';
import { Quiz } from '@/domain/activities/quizzes/quiz.aggregate';
import type { IActivityRepository } from '@/domain/activities/repositories';
import { type ActivityId, ActivityType } from '@/domain/activities/value-objects';
import type { Db } from '@/infra/common/types';
import {
	activitiesTable,
	articlesTable,
	exercisesTable,
	questionsTable,
	quizzesTable,
} from '../common/db/schemas';

@Injectable()
export class PostgresActivityRepository implements IActivityRepository {
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	async load(id: ActivityId): Promise<Activity | null> {
		const rawId = id.value;

		try {
			const result = await this.db.transaction(async (tx) => {
				const [dbActivity] = await tx
					.select()
					.from(activitiesTable)
					.where(eq(activitiesTable.id, rawId));

				if (!dbActivity) {
					return null;
				}

				switch (dbActivity.type) {
					case ActivityType.ARTICLE: {
						const [dbArticle] = await tx
							.select()
							.from(articlesTable)
							.where(eq(articlesTable.activityId, rawId));

						if (!dbArticle) {
							return null;
						}

						return Article.fromDataSource({
							id: dbActivity.id,
							lessonId: dbActivity.lessonId,
							name: dbActivity.name,
							description: dbActivity.description,
							createdAt: dbActivity.createdAt,
							updatedAt: dbActivity.updatedAt,
							order: dbActivity.order,
							ref: dbArticle.ref,
						});
					}

					case ActivityType.EXERCISE: {
						const [dbExercise] = await tx
							.select()
							.from(exercisesTable)
							.where(eq(exercisesTable.activityId, rawId));

						if (!dbExercise) {
							return null;
						}

						return Exercise.fromDataSource({
							id: dbActivity.id,
							lessonId: dbActivity.lessonId,
							name: dbActivity.name,
							description: dbActivity.description,
							createdAt: dbActivity.createdAt,
							updatedAt: dbActivity.updatedAt,
							order: dbActivity.order,
							difficulty: dbExercise.difficulty,
						});
					}

					case ActivityType.QUIZ: {
						const [dbQuiz] = await tx
							.select()
							.from(quizzesTable)
							.where(eq(quizzesTable.activityId, rawId));

						if (!dbQuiz) {
							return null;
						}

						const dbQuestions = await tx
							.select()
							.from(questionsTable)
							.where(eq(questionsTable.quizId, rawId));

						const questions = dbQuestions.map((q) =>
							Question.fromDataSource({
								id: q.id,
								quizId: q.quizId,
								content: q.content,
								correctAnswer: q.correctAnswer,
								order: q.order,
								createdAt: q.createdAt,
								updatedAt: q.updatedAt,
							}),
						);

						return Quiz.fromDataSource({
							id: dbActivity.id,
							lessonId: dbActivity.lessonId,
							name: dbActivity.name,
							description: dbActivity.description,
							createdAt: dbActivity.createdAt,
							updatedAt: dbActivity.updatedAt,
							order: dbActivity.order,
							questions,
							questionCount: questions.length,
						});
					}

					default:
						return null;
				}
			});

			return result;
		} catch (err) {
			throw new RepositoryException('postgres exception', err);
		}
	}

	async remove(id: ActivityId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(activitiesTable)
				.where(eq(activitiesTable.id, id.value));

			return result.rows.length > 0;
		} catch (err) {
			throw new RepositoryException('postgres exception', err);
		}
	}

	async save(aggregate: Activity): Promise<void> {
		try {
			await this.db.transaction(async (tx) => {
				await tx
					.insert(activitiesTable)
					.values({
						id: aggregate.id.value,
						lessonId: aggregate.lessonId.value,
						name: aggregate.name.value,
						description: aggregate.description?.value ?? null,
						order: aggregate.order.value,
						type: aggregate.type,
						createdAt: aggregate.createdAt,
						updatedAt: aggregate.updatedAt,
					})
					.onConflictDoUpdate({
						target: activitiesTable.id,
						set: {
							name: aggregate.name.value,
							description: aggregate.description?.value ?? null,
							order: aggregate.order.value,
							updatedAt: aggregate.updatedAt,
						},
					});

				if (aggregate instanceof Article) {
					await tx
						.insert(articlesTable)
						.values({
							activityId: aggregate.id.value,
							ref: aggregate.ref.value,
						})
						.onConflictDoUpdate({
							target: articlesTable.activityId,
							set: {
								ref: aggregate.ref.value,
							},
						});
				} else if (aggregate instanceof Exercise) {
					await tx
						.insert(exercisesTable)
						.values({
							activityId: aggregate.id.value,
							difficulty: aggregate.difficulty,
						})
						.onConflictDoUpdate({
							target: exercisesTable.activityId,
							set: {
								difficulty: aggregate.difficulty,
							},
						});
				} else if (aggregate instanceof Quiz) {
					await tx
						.insert(quizzesTable)
						.values({
							activityId: aggregate.id.value,
						})
						.onConflictDoNothing({
							target: quizzesTable.activityId,
						});

					for (const question of aggregate.questions) {
						await tx
							.insert(questionsTable)
							.values({
								id: question.id.value,
								quizId: aggregate.id.value,
								content: question.content,
								correctAnswer: question.correctAnswer,
								order: question.order.value,
								createdAt: question.createdAt,
								updatedAt: question.updatedAt,
							})
							.onConflictDoUpdate({
								target: questionsTable.id,
								set: {
									content: question.content,
									correctAnswer: question.correctAnswer,
									order: question.order.value,
									updatedAt: question.updatedAt,
								},
							});
					}

					// Remove questions that are no longer in the aggregate
					const questionIds = aggregate.questions.map((q) => q.id.value);
					if (questionIds.length > 0) {
						const existingQuestions = await tx
							.select({ id: questionsTable.id })
							.from(questionsTable)
							.where(eq(questionsTable.quizId, aggregate.id.value));

						for (const existing of existingQuestions) {
							if (!questionIds.includes(existing.id)) {
								await tx
									.delete(questionsTable)
									.where(eq(questionsTable.id, existing.id));
							}
						}
					} else {
						await tx
							.delete(questionsTable)
							.where(eq(questionsTable.quizId, aggregate.id.value));
					}
				}
			});
		} catch (err) {
			throw new RepositoryException('postgres exception', err);
		}
	}
}
