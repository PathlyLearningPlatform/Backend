import { integer, pgEnum, pgTable, unique, uuid } from 'drizzle-orm/pg-core';
import { ActivityType } from '@/domain/activities/enums';
import { createdAt, updatedAt } from './helpers';
import { lessonsTable } from './lessons.table';

export const activityTypeEnum = pgEnum('activity_type', ActivityType);

export const activitiesTable = pgTable(
	'activities',
	{
		id: uuid().primaryKey().defaultRandom(),
		lessonId: uuid()
			.notNull()
			.references(() => lessonsTable.id),
		createdAt,
		updatedAt,
		order: integer(),
		type: activityTypeEnum().notNull(),
	},
	(t) => [unique().on(t.lessonId, t.order)],
);
