import { integer, jsonb, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { quizzesTable } from './quizzes.table';

export const quizAttemptsTable = pgTable('quiz_attempts', {
	id: uuid('id').primaryKey(),
	quizId: uuid('quiz_id')
		.notNull()
		.references(() => quizzesTable.activityId),
	userId: uuid('user_id').notNull(),
	attemptedAt: timestamp('attempted_at').notNull(),
	score: integer().notNull(),
	answers: jsonb()
		.$type<{ questionId: string; text: string; isCorrect: boolean }>()
		.array()
		.notNull(),
});
