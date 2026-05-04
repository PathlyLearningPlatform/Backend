import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
	id: uuid().primaryKey(),
	username: text().notNull().unique(),
	email: text().notNull().unique(),
});
