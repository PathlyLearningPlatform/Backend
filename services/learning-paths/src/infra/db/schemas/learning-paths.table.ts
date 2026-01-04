import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { LearningPathConstraints } from '@/domain/learning-paths/enums';
import { createdAt, updatedAt } from './helpers';

export const learningPathsTable = pgTable('learning_paths', {
	id: uuid().primaryKey().defaultRandom(),
	createdAt,
	updatedAt,
	name: varchar({ length: LearningPathConstraints.MAX_NAME_LENGTH }).notNull(),
	description: text(),
});
