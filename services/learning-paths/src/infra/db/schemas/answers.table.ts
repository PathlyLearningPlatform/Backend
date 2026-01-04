import { boolean, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { questionsTable } from './questions.table';

export const answersTable = pgTable('answers', {
	id: uuid().primaryKey().defaultRandom(),
	questionId: uuid()
		.notNull()
		.references(() => questionsTable.id),
	content: varchar({ length: 512 }).notNull(),
	isCorrect: boolean().notNull(),
});
