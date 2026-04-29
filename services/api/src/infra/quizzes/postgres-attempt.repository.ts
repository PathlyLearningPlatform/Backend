import { QuizAttemptId, QuizAttempt } from '@/domain/quizzes';
import {
	IQuizAttemptRepository,
	ListQuizAttemptsOptions,
} from '@/domain/quizzes/repositories';
import { Inject, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Db } from '../db/types';
import { quizAttemptsTable } from '../db/schemas';
import { and, eq } from 'drizzle-orm';
import { DbException } from '../common';
import { isTypeNode } from 'typescript';
import { UserId } from '@/domain/common';

@Injectable()
export class PostgresQuizAttemptRepository implements IQuizAttemptRepository {
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	async findById(id: QuizAttemptId): Promise<QuizAttempt | null> {
		try {
			const [quizAttempt] = await this.db
				.select()
				.from(quizAttemptsTable)
				.where(eq(quizAttemptsTable.id, id.value));

			if (!quizAttempt) {
				return null;
			}

			return QuizAttempt.fromDataSource(quizAttempt);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async findForUser(
		id: QuizAttemptId,
		userId: UserId,
	): Promise<QuizAttempt | null> {
		try {
			const [quizAttempt] = await this.db
				.select()
				.from(quizAttemptsTable)
				.where(
					and(
						eq(quizAttemptsTable.id, id.value),
						eq(quizAttemptsTable.userId, userId.toString()),
					),
				);

			if (!quizAttempt) {
				return null;
			}

			return QuizAttempt.fromDataSource(quizAttempt);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async list(options?: ListQuizAttemptsOptions): Promise<QuizAttempt[]> {
		const limit = options?.options?.limit ?? 100;
		const page = options?.options?.page ?? 0;
		const userId = options?.where?.userId;
		const quizId = options?.where?.quizId;

		try {
			const quizAttempts = await this.db
				.select()
				.from(quizAttemptsTable)
				.where(
					and(
						quizId ? eq(quizAttemptsTable.quizId, quizId) : undefined,
						userId ? eq(quizAttemptsTable.userId, userId) : undefined,
					),
				)
				.limit(limit)
				.offset(limit * page);

			return quizAttempts.map(QuizAttempt.fromDataSource);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async remove(id: QuizAttemptId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(quizAttemptsTable)
				.where(eq(quizAttemptsTable.id, id.value));

			return result.rows.length > 0;
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async save(aggregate: QuizAttempt): Promise<void> {
		try {
			await this.db
				.insert(quizAttemptsTable)
				.values({
					id: aggregate.id.value,
					quizId: aggregate.quizId.value,
					userId: aggregate.userId.toString(),
					score: aggregate.score,
					attemptedAt: aggregate.attemptedAt,
					answers: aggregate.answers.map((item) => ({
						isCorrect: item.isCorrect ?? false,
						text: item.text,
						questionId: item.questionId.value,
					})),
				})
				.onConflictDoNothing({
					target: quizAttemptsTable.id,
				});
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}
}
