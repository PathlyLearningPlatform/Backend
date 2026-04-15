import {
	integer,
	pgTable,
	timestamp,
	uuid,
	primaryKey,
} from 'drizzle-orm/pg-core';
import { sectionsTable } from './sections.table';
import { unitsTable } from './units.table';

export const unitProgressTable = pgTable(
	'unit_progress',
	{
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
	(t) => [primaryKey({ columns: [t.unitId, t.userId] })],
);
