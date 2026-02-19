import {
	integer,
	pgEnum,
	pgTable,
	timestamp,
	unique,
	uuid,
} from 'drizzle-orm/pg-core';

const status = pgEnum('learning_path_progress_status', [
	'NOT_STARTED',
	'IN_PROGRESS',
	'DONE',
]);

export const learningPathProgressTable = pgTable(
	'learning_path_progress',
	{
		id: uuid('id').primaryKey(),
		learningPathId: uuid('learning_path_id').notNull(),
		userId: uuid('user_id').notNull(),
		status: status().notNull().default('NOT_STARTED'),
		completedSectionsCount: integer('completed_sections_count')
			.notNull()
			.default(0),
		completedAt: timestamp(),
	},
	(t) => [unique().on(t.learningPathId, t.userId)],
);
