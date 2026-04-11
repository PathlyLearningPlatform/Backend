import { pgTable, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core';
import { activitiesTable } from './activities.table';
import { lessonsTable } from './lessons.table';

export const activityProgressTable = pgTable(
	'activity_progress',
	{
		id: varchar('id', { length: 73 }).primaryKey(),
		activityId: uuid('activity_id')
			.notNull()
			.references(() => activitiesTable.id),
		lessonId: uuid('lesson_id')
			.notNull()
			.references(() => lessonsTable.id),
		userId: uuid('user_id').notNull(),
		completedAt: timestamp('completed_at'),
	},
	(t) => [
		unique('uq_activity_progress_activity_id_user_id').on(
			t.activityId,
			t.userId,
		),
	],
);
