import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { activitiesTable } from './activities.table';

export const articlesTable = pgTable('articles', {
	activityId: uuid()
		.primaryKey()
		.references(() => activitiesTable.id),
	ref: text(),
});
