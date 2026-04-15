import {
	integer,
	pgTable,
	timestamp,
	uuid,
	primaryKey,
} from 'drizzle-orm/pg-core';
import { lessonsTable } from './lessons.table';
import { unitsTable } from './units.table';

export const lessonProgressTable = pgTable(
	'lesson_progress',
	{
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
	(t) => [primaryKey({ columns: [t.lessonId, t.userId] })],
);
