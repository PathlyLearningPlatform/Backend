import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createdAt, updatedAt } from './helpers';

export const articlesTable = pgTable('articles', {
	id: uuid().primaryKey(),
	name: text().notNull(),
	description: text(),
	ref: text('ref').notNull(),
	createdAt,
	updatedAt,
});
