import {
	integer,
	pgTable,
	text,
	unique,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';
import { createdAt, updatedAt } from './helpers';
import { unitsTable } from './units.table';

export const lessonsTable = pgTable(
	'lessons',
	{
		id: uuid('id').primaryKey(),
		unitId: uuid('unit_id')
			.notNull()
			.references(() => unitsTable.id),
		createdAt,
		updatedAt,
		name: varchar('name', { length: 255 }).notNull(),
		description: text('description'),
		order: integer('order').notNull(),
		activityCount: integer('activity_count').notNull().default(0),
	},
	(t) => [unique('uq_lessons_unit_id_order').on(t.unitId, t.order)],
);
