import {
	integer,
	pgTable,
	text,
	unique,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';
import { createdAt, updatedAt } from './helpers';
import { sectionsTable } from './sections.table';

export const unitsTable = pgTable(
	'units',
	{
		id: uuid().primaryKey().defaultRandom(),
		sectionId: uuid()
			.notNull()
			.references(() => sectionsTable.id),
		createdAt,
		updatedAt,
		name: varchar({ length: 255 }).notNull(),
		description: text().notNull(),
		order: integer(),
	},
	(t) => [unique().on(t.sectionId, t.order)],
);
