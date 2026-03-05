import { integer, timestamp } from 'drizzle-orm/pg-core';
import { pgTable, uuid } from 'drizzle-orm/pg-core';

export const lessonProgressTable = pgTable('lesson_progress', {
	id: uuid().primaryKey(),
	lessonId: uuid().notNull(),
	userId: uuid().notNull(),
	completedAt: timestamp(),
	completedActivityCount: integer().notNull().default(0),
	totalActivityCount: integer().notNull(),
});
