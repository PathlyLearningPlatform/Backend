import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core';
import { quizzesTable } from './quizzes.table';

export const questionsTable = pgTable('questions', {
	id: uuid().primaryKey(),
	order: integer().notNull().unique(),
	quizId: uuid('quiz_id')
		.notNull()
		.references(() => quizzesTable.activityId, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	correctAnswer: text('correct_answer').notNull(),
});
