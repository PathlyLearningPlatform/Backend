import { integer, pgTable, timestamp, unique, uuid } from 'drizzle-orm/pg-core';

export const sectionProgressTable = pgTable(
	'section_progress',
	{
		id: uuid('id').primaryKey(),
		sectionId: uuid('section_id').notNull(),
		learningPathId: uuid('learning_path_id').notNull(),
		userId: uuid('user_id').notNull(),
		completedAt: timestamp('completed_at'),
		completedUnitCount: integer('completed_unit_count').notNull().default(0),
		totalUnitCount: integer('total_unit_count').notNull(),
	},
	(t) => [unique().on(t.sectionId, t.userId)],
);
