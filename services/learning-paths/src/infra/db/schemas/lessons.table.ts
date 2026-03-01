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
		id: uuid().primaryKey(),
		unitId: uuid()
			.notNull()
			.references(() => unitsTable.id),
		createdAt,
		updatedAt,
		name: varchar({ length: 255 }).notNull(),
		description: text(),
		order: integer().notNull(),
		activityCount: integer().notNull().default(0),
	},
	(t) => [unique().on(t.unitId, t.order)],
);
