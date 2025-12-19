import {
	integer,
	pgTable,
	text,
	unique,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';
import { createdAt, updatedAt } from './helpers';
import { pathsTable } from './paths.table';

export const sectionsTable = pgTable(
	'sections',
	{
		id: uuid().primaryKey().defaultRandom(),
		pathId: uuid()
			.notNull()
			.references(() => pathsTable.id),
		createdAt,
		updatedAt,
		name: varchar({ length: 255 }).notNull(),
		description: text(),
		order: integer().notNull(),
	},
	(t) => [unique().on(t.pathId, t.order)],
);
