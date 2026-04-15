import { pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';
import { activitiesTable } from './activities.table';
import { lessonsTable } from './lessons.table';

export const activityProgressTable = pgTable(
	'activity_progress',
	{
		activityId: uuid('activity_id')
			.notNull()
			.references(() => activitiesTable.id),
		lessonId: uuid('lesson_id')
			.notNull()
			.references(() => lessonsTable.id),
		userId: uuid('user_id').notNull(),
		completedAt: timestamp('completed_at'),
	},
	(t) => [primaryKey({ columns: [t.activityId, t.userId] })],
);
