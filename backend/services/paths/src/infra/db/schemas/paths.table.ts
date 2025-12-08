import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { createdAt, updatedAt } from './helpers';

export const pathsTable = pgTable('paths', {
	id: uuid().primaryKey().defaultRandom(),
	createdAt,
	updatedAt,
	name: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
});
