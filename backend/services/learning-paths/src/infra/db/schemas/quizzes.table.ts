import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { itemsTable } from './items.table';

export const quizzesTable = pgTable('quizzes', {
	itemId: uuid()
		.primaryKey()
		.references(() => itemsTable.id),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
});
