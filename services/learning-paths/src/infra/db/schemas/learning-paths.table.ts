import { integer, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { LearningPathConstraints } from '@/domain/learning-paths/enums';
import { createdAt, updatedAt } from './helpers';

export const learningPathsTable = pgTable('learning_paths', {
	id: uuid().primaryKey(),
	createdAt,
	updatedAt,
	name: varchar({ length: LearningPathConstraints.MAX_NAME_LENGTH }).notNull(),
	description: text(),
	sectionCount: integer().notNull().default(0),
});
