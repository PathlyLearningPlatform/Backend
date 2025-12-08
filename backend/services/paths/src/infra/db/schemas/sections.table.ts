import { integer, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { createdAt, updatedAt } from './helpers';
import { pathsTable } from './paths.table';
import { unique } from 'drizzle-orm/pg-core';

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
		description: text().notNull(),
		order: integer(),
	},
	(t) => [unique().on(t.pathId, t.order)],
);
