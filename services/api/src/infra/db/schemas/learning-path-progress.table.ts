import {
	integer,
	pgTable,
	timestamp,
	uuid,
	primaryKey,
} from 'drizzle-orm/pg-core';
import { learningPathsTable } from './learning-paths.table';

export const learningPathProgressTable = pgTable(
	'learning_path_progress',
	{
		learningPathId: uuid('learning_path_id')
			.notNull()
			.references(() => learningPathsTable.id),
		userId: uuid('user_id').notNull(),
		completedAt: timestamp('completed_at'),
		completedSectionCount: integer('completed_section_count')
			.notNull()
			.default(0),
		totalSectionCount: integer('total_section_count').notNull(),
	},
	(t) => [primaryKey({ columns: [t.learningPathId, t.userId] })],
);
