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
		id: uuid('id').primaryKey(),
		sectionId: uuid('section_id')
			.notNull()
			.references(() => sectionsTable.id),
		createdAt,
		updatedAt,
		name: varchar('name', { length: 255 }).notNull(),
		description: text('description'),
		order: integer('order').notNull(),
		lessonCount: integer('lesson_count').notNull().default(0),
	},
	(t) => [unique().on(t.sectionId, t.order)],
);
