import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { quizzesTable } from './quizzes.table';

export const questionsTable = pgTable('questions', {
	id: uuid().primaryKey(),
	quizId: uuid()
		.notNull()
		.references(() => quizzesTable.activityId),
	content: varchar({ length: 512 }).notNull(),
});
