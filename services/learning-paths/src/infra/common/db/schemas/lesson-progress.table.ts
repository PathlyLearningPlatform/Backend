import {
	integer,
	pgTable,
	timestamp,
	unique,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';
import { lessonsTable } from './lessons.table';
import { unitsTable } from './units.table';

export const lessonProgressTable = pgTable(
	'lesson_progress',
	{
		id: varchar('id', { length: 73 }).primaryKey(),
		lessonId: uuid('lesson_id')
			.notNull()
			.references(() => lessonsTable.id),
		unitId: uuid('unit_id')
			.notNull()
			.references(() => unitsTable.id),
		userId: uuid('user_id').notNull(),
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
