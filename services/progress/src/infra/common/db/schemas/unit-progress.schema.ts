import { integer, pgTable, timestamp, unique, uuid } from 'drizzle-orm/pg-core';

export const unitProgressTable = pgTable(
	'unit_progress',
	{
		id: uuid('id').primaryKey(),
		unitId: uuid('unit_id').notNull(),
		sectionId: uuid('section_id').notNull(),
		userId: uuid('user_id').notNull(),
		completedAt: timestamp('completed_at'),
		completedLessonCount: integer('completed_lesson_count')
			.notNull()
			.default(0),
		totalLessonCount: integer('total_lesson_count').notNull(),
	},
	(t) => [unique().on(t.unitId, t.userId)],
);
