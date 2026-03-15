import { pgTable, timestamp, unique, uuid } from 'drizzle-orm/pg-core';

export const activityProgressTable = pgTable(
	'activity_progress',
	{
		id: uuid().primaryKey(),
		userId: uuid('user_id').notNull(),
		activityId: uuid('activity_id').notNull(),
		lessonId: uuid('lesson_id').notNull(),
		completedAt: timestamp('completed_at'),
	},
	(t) => [unique().on(t.activityId, t.userId)],
);
