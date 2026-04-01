import { integer, timestamp, unique } from 'drizzle-orm/pg-core';
import { pgTable, uuid } from 'drizzle-orm/pg-core';

export const lessonProgressTable = pgTable(
	'lesson_progress',
	{
		id: uuid('id').primaryKey(),
		lessonId: uuid('lesson_id').notNull(),
		userId: uuid('user_id').notNull(),
		unitId: uuid('unit_id').notNull(),
		completedAt: timestamp('completed_at'),
		completedActivityCount: integer('completed_activity_count')
			.notNull()
			.default(0),
		totalActivityCount: integer('total_activity_count').notNull(),
	},
	(t) => [
		unique('uq_lesson_progress_lesson_id_user_id').on(t.lessonId, t.userId),
	],
);
