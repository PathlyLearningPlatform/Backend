import {
	integer,
	pgTable,
	timestamp,
	unique,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';
import { sectionsTable } from './sections.table';
import { unitsTable } from './units.table';

export const unitProgressTable = pgTable(
	'unit_progress',
	{
		id: varchar('id', { length: 73 }).primaryKey(),
		unitId: uuid('unit_id')
			.notNull()
			.references(() => unitsTable.id),
		sectionId: uuid('section_id')
			.notNull()
			.references(() => sectionsTable.id),
		userId: uuid('user_id').notNull(),
		completedAt: timestamp('completed_at'),
		completedLessonCount: integer('completed_lesson_count')
			.notNull()
			.default(0),
		totalLessonCount: integer('total_lesson_count').notNull(),
	},
	(t) => [unique('uq_unit_progress_unit_id_user_id').on(t.unitId, t.userId)],
);
