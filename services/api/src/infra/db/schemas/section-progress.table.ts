import {
	integer,
	pgTable,
	timestamp,
	uuid,
	primaryKey,
} from 'drizzle-orm/pg-core';
import { learningPathsTable } from './learning-paths.table';
import { sectionsTable } from './sections.table';

export const sectionProgressTable = pgTable(
	'section_progress',
	{
		sectionId: uuid('section_id')
			.notNull()
			.references(() => sectionsTable.id),
		learningPathId: uuid('learning_path_id')
			.notNull()
			.references(() => learningPathsTable.id),
		userId: uuid('user_id').notNull(),
		completedAt: timestamp('completed_at'),
		completedUnitCount: integer('completed_unit_count').notNull().default(0),
		totalUnitCount: integer('total_unit_count').notNull(),
	},
	(t) => [primaryKey({ columns: [t.sectionId, t.userId] })],
);
