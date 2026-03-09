import {
	integer,
	pgEnum,
	pgTable,
	text,
	unique,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';
import { ActivityType } from '@/domain/activities/value-objects';
import { createdAt, updatedAt } from './helpers';
import { lessonsTable } from './lessons.table';

export const activityTypeEnum = pgEnum('activity_type', ActivityType);
export const activitiesTable = pgTable(
	'activities',
	{
		id: uuid('id').primaryKey(),
		lessonId: uuid('lesson_id')
			.notNull()
			.references(() => lessonsTable.id),
		createdAt,
		updatedAt,
		name: varchar('name', { length: 255 }).notNull(),
		description: text('description'),
		order: integer('order').notNull(),
		type: activityTypeEnum().notNull(),
	},
	(t) => [unique().on(t.lessonId, t.order)],
);
