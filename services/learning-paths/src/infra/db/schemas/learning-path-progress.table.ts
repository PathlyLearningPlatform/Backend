import {
	integer,
	pgTable,
	timestamp,
	unique,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';
import { learningPathsTable } from './learning-paths.table';

export const learningPathProgressTable = pgTable(
	'learning_path_progress',
	{
		id: varchar('id', { length: 73 }).primaryKey(),
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
	(t) => [
		unique('uq_learning_path_progress_learning_path_id_user_id').on(
			t.learningPathId,
			t.userId,
		),
	],
);
