import {
	integer,
	pgTable,
	timestamp,
	unique,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';
import { learningPathsTable } from './learning-paths.table';
import { sectionsTable } from './sections.table';

export const sectionProgressTable = pgTable(
	'section_progress',
	{
		id: varchar('id', { length: 73 }).primaryKey(),
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
	(t) => [
		unique('uq_section_progress_section_id_user_id').on(t.sectionId, t.userId),
	],
);
