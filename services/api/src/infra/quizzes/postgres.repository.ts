import { DbService } from '@/infra/db/db.service';
import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@infra/common';
import { and, eq } from 'drizzle-orm';
import { Question } from '@/domain/quizzes/question.entity';
import { Quiz } from '@/domain/quizzes/quiz.aggregate';
import { ActivityId } from '@/domain/activities/value-objects';
import type { Db } from '@/infra/db/types';
import { activitiesTable, questionsTable, quizzesTable } from '../db/schemas';
import {
	IQuizRepository,
	ListQuizzesOptions,
} from '@/domain/quizzes/repositories';
import { QuestionId } from '@/domain/quizzes';
import { Order } from '@/domain/common';
import { ActivitiesApiConstraints } from '../activities/enums';

@Injectable()
export class PostgresQuizRepository implements IQuizRepository {
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	async findById(id: ActivityId): Promise<Quiz | null> {
		try {
			const [activity] = await this.db
				.select()
				.from(activitiesTable)
				.where(eq(activitiesTable.id, id.value));

			const [quiz] = await this.db
				.select()
				.from(quizzesTable)
				.where(eq(quizzesTable.activityId, id.value));

			if (!activity || !quiz) {
				return null;
			}

			const questions = await this.db
				.select()
				.from(questionsTable)
				.where(eq(questionsTable.quizId, id.value));

			return Quiz.fromDataSource({
				id: id.value,
				lessonId: activity.lessonId,
				createdAt: activity.createdAt,
				updatedAt: activity.updatedAt,
				maxScore: questions.length,
				name: activity.name,
				description: activity.description,
				order: activity.order,
				questionCount: questions.length,
				questions: questions.map((item) =>
					Question.create(QuestionId.create(item.id), {
						content: item.content,
						correctAnswer: item.correctAnswer,
						createdAt: item.createdAt,
						order: Order.create(item.order),
						quizId: id,
					}),
				),
			});
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async list(options?: ListQuizzesOptions): Promise<Quiz[]> {
		const limit =
			options?.options?.limit ?? ActivitiesApiConstraints.DEFAULT_LIMIT;
		const page =
			options?.options?.page ?? ActivitiesApiConstraints.DEFAULT_PAGE;

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
						options?.where?.lessonId
							? eq(activitiesTable.lessonId, options.where.lessonId)
							: undefined,
					),
				)
				.limit(limit)
				.offset(limit * page);

			return result.map((item) =>
				Quiz.fromDataSource({
					id: item.quizzes.activityId,
					createdAt: item.activities.createdAt,
					description: item.activities.description,
					lessonId: item.activities.lessonId,
					maxScore: 0,
					name: item.activities.name,
					order: item.activities.order,
					questionCount: 0,
					questions: [],
					updatedAt: item.activities.updatedAt,
				}),
			);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async remove(id: ActivityId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(activitiesTable)
				.where(eq(activitiesTable.id, id.value));

			return result.rows.length > 0;
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async save(aggregate: Quiz): Promise<void> {
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
			});
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}
}
