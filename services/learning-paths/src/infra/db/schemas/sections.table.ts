import {
	integer,
	pgTable,
	text,
	unique,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';
import { createdAt, updatedAt } from './helpers';
import { learningPathsTable } from './learning-paths.table';

export const sectionsTable = pgTable(
	'sections',
	{
		id: uuid().primaryKey(),
		learningPathId: uuid()
			.notNull()
			.references(() => learningPathsTable.id),
		createdAt,
		updatedAt,
		name: varchar({ length: 255 }).notNull(),
		description: text(),
		order: integer().notNull(),
	},
	(t) => [unique().on(t.learningPathId, t.order)],
);
