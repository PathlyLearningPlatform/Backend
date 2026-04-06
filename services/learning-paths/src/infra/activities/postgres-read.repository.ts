import * as schema from '@infra/common/db/schemas';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type {
	ActivityDto,
	ArticleDto,
	ExerciseDto,
	QuestionDto,
	QuizDto,
	QuizWithoutQuestionsDto,
} from '@/app/activities/dtos';
import type {
	ActivityFilter,
	IActivityReadRepository,
} from '@/app/activities/interfaces';
import { ActivityType } from '@/domain/activities/value-objects';
import { DbService } from '../common/db/db.service';
import { ActivitiesApiConstraints } from './enums';

@Injectable()
export class PostgresActivityReadRepository implements IActivityReadRepository {
	private readonly db: NodePgDatabase<typeof schema>;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(filter?: ActivityFilter): Promise<ActivityDto[]> {
		const limit =
			filter?.options?.limit ?? ActivitiesApiConstraints.DEFAULT_LIMIT;
		const page = filter?.options?.page ?? ActivitiesApiConstraints.DEFAULT_PAGE;
		const lessonId = filter?.where?.lessonId;

		const activities = await this.db
			.select()
			.from(schema.activitiesTable)
			.where(
				lessonId ? eq(schema.activitiesTable.lessonId, lessonId) : undefined,
			)
			.limit(limit)
			.offset(page * limit);

		return activities;
	}

	async listArticles(filter?: ActivityFilter): Promise<ArticleDto[]> {
		const limit =
			filter?.options?.limit ?? ActivitiesApiConstraints.DEFAULT_LIMIT;
		const page = filter?.options?.page ?? ActivitiesApiConstraints.DEFAULT_PAGE;
		const lessonId = filter?.where?.lessonId;

		const rows = await this.db
			.select({
				id: schema.activitiesTable.id,
				lessonId: schema.activitiesTable.lessonId,
				name: schema.activitiesTable.name,
				description: schema.activitiesTable.description,
				createdAt: schema.activitiesTable.createdAt,
				updatedAt: schema.activitiesTable.updatedAt,
				order: schema.activitiesTable.order,
				ref: schema.articlesTable.ref,
				type: schema.activitiesTable.type,
			})
			.from(schema.activitiesTable)
			.innerJoin(
				schema.articlesTable,
				eq(schema.activitiesTable.id, schema.articlesTable.activityId),
			)
			.where(
				lessonId ? eq(schema.activitiesTable.lessonId, lessonId) : undefined,
			)
			.limit(limit)
			.offset(page * limit);

		return rows;
	}

	async listExercises(filter?: ActivityFilter): Promise<ExerciseDto[]> {
		const limit =
			filter?.options?.limit ?? ActivitiesApiConstraints.DEFAULT_LIMIT;
		const page = filter?.options?.page ?? ActivitiesApiConstraints.DEFAULT_PAGE;
		const lessonId = filter?.where?.lessonId;

		const rows = await this.db
			.select({
				id: schema.activitiesTable.id,
				lessonId: schema.activitiesTable.lessonId,
				name: schema.activitiesTable.name,
				description: schema.activitiesTable.description,
				createdAt: schema.activitiesTable.createdAt,
				updatedAt: schema.activitiesTable.updatedAt,
				order: schema.activitiesTable.order,
				difficulty: schema.exercisesTable.difficulty,
				type: schema.activitiesTable.type,
			})
			.from(schema.activitiesTable)
			.innerJoin(
				schema.exercisesTable,
				eq(schema.activitiesTable.id, schema.exercisesTable.activityId),
			)
			.where(
				lessonId ? eq(schema.activitiesTable.lessonId, lessonId) : undefined,
			)
			.limit(limit)
			.offset(page * limit);

		return rows;
	}

	async listQuizzes(
		filter?: ActivityFilter,
	): Promise<QuizWithoutQuestionsDto[]> {
		const limit =
			filter?.options?.limit ?? ActivitiesApiConstraints.DEFAULT_LIMIT;
		const page = filter?.options?.page ?? ActivitiesApiConstraints.DEFAULT_PAGE;
		const lessonId = filter?.where?.lessonId;

		const rows = await this.db
			.select({
				id: schema.activitiesTable.id,
				lessonId: schema.activitiesTable.lessonId,
				name: schema.activitiesTable.name,
				description: schema.activitiesTable.description,
				createdAt: schema.activitiesTable.createdAt,
				updatedAt: schema.activitiesTable.updatedAt,
				order: schema.activitiesTable.order,
				type: schema.activitiesTable.type,
			})
			.from(schema.activitiesTable)
			.innerJoin(
				schema.quizzesTable,
				eq(schema.activitiesTable.id, schema.quizzesTable.activityId),
			)
			.where(
				lessonId ? eq(schema.activitiesTable.lessonId, lessonId) : undefined,
			)
			.limit(limit)
			.offset(page * limit);

		// Need to get question counts
		const result: QuizWithoutQuestionsDto[] = [];
		for (const row of rows) {
			const [countRow] = await this.db
				.select({ id: schema.questionsTable.id })
				.from(schema.questionsTable)
				.where(eq(schema.questionsTable.quizId, row.id));

			const questionCountRows = await this.db
				.select({ id: schema.questionsTable.id })
				.from(schema.questionsTable)
				.where(eq(schema.questionsTable.quizId, row.id));

			result.push({
				...row,
				questionCount: questionCountRows.length,
			});
		}

		return result;
	}

	async findById(id: string): Promise<ActivityDto | null> {
		const [activity] = await this.db
			.select()
			.from(schema.activitiesTable)
			.where(eq(schema.activitiesTable.id, id));

		return activity ?? null;
	}

	async findArticleById(id: string): Promise<ArticleDto | null> {
		const [row] = await this.db
			.select({
				id: schema.activitiesTable.id,
				lessonId: schema.activitiesTable.lessonId,
				name: schema.activitiesTable.name,
				description: schema.activitiesTable.description,
				createdAt: schema.activitiesTable.createdAt,
				updatedAt: schema.activitiesTable.updatedAt,
				order: schema.activitiesTable.order,
				ref: schema.articlesTable.ref,
				type: schema.activitiesTable.type,
			})
			.from(schema.activitiesTable)
			.innerJoin(
				schema.articlesTable,
				eq(schema.activitiesTable.id, schema.articlesTable.activityId),
			)
			.where(eq(schema.activitiesTable.id, id));

		return row ?? null;
	}

	async findExerciseById(id: string): Promise<ExerciseDto | null> {
		const [row] = await this.db
			.select({
				id: schema.activitiesTable.id,
				lessonId: schema.activitiesTable.lessonId,
				name: schema.activitiesTable.name,
				description: schema.activitiesTable.description,
				createdAt: schema.activitiesTable.createdAt,
				updatedAt: schema.activitiesTable.updatedAt,
				order: schema.activitiesTable.order,
				difficulty: schema.exercisesTable.difficulty,
				type: schema.activitiesTable.type,
			})
			.from(schema.activitiesTable)
			.innerJoin(
				schema.exercisesTable,
				eq(schema.activitiesTable.id, schema.exercisesTable.activityId),
			)
			.where(eq(schema.activitiesTable.id, id));

		return row ?? null;
	}

	async findQuizById(id: string): Promise<QuizDto | null> {
		const [row] = await this.db
			.select({
				id: schema.activitiesTable.id,
				lessonId: schema.activitiesTable.lessonId,
				name: schema.activitiesTable.name,
				description: schema.activitiesTable.description,
				createdAt: schema.activitiesTable.createdAt,
				updatedAt: schema.activitiesTable.updatedAt,
				order: schema.activitiesTable.order,
				type: schema.activitiesTable.type,
			})
			.from(schema.activitiesTable)
			.innerJoin(
				schema.quizzesTable,
				eq(schema.activitiesTable.id, schema.quizzesTable.activityId),
			)
			.where(eq(schema.activitiesTable.id, id));

		if (!row) {
			return null;
		}

		const dbQuestions = await this.db
			.select()
			.from(schema.questionsTable)
			.where(eq(schema.questionsTable.quizId, id));

		const questions: QuestionDto[] = dbQuestions.map((q) => ({
			id: q.id,
			quizId: q.quizId,
			content: q.content,
			correctAnswer: q.correctAnswer,
		}));

		return {
			...row,
			questionCount: questions.length,
			questions,
		};
	}
}
