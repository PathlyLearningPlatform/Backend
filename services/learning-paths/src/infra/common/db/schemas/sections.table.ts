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
		id: uuid('id').primaryKey(),
		learningPathId: uuid('learning_path_id')
			.notNull()
			.references(() => learningPathsTable.id),
		createdAt,
		updatedAt,
		name: varchar('name', { length: 255 }).notNull(),
		description: text('description'),
		order: integer('order').notNull(),
		unitCount: integer('unit_count').notNull().default(0),
	},
	(t) => [unique().on(t.learningPathId, t.order)],
);
