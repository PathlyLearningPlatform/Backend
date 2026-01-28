import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { activitiesTable } from './activities.table';

export const quizzesTable = pgTable('quizzes', {
	activityId: uuid()
		.primaryKey()
		.references(() => activitiesTable.id, { onDelete: 'cascade' }),
});
