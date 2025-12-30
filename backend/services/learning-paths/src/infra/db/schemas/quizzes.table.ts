import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { activitiesTable } from './activities.table';

export const quizzesTable = pgTable('quizzes', {
	activityId: uuid()
		.primaryKey()
		.references(() => activitiesTable.id),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
});
