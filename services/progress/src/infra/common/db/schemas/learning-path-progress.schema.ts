import { integer, pgTable, timestamp, unique, uuid } from 'drizzle-orm/pg-core';

export const learningPathProgressTable = pgTable(
	'learning_path_progress',
	{
		id: uuid('id').primaryKey(),
		learningPathId: uuid('learning_path_id').notNull(),
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
