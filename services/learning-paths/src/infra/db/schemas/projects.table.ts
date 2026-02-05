import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { createdAt, updatedAt } from './helpers';
import { learningPathsTable } from './learning-paths.table';
import { sectionsTable } from './sections.table';

export const projectsTable = pgTable('projects', {
	id: uuid().primaryKey(),
	learningPathId: uuid().references(() => learningPathsTable.id),
	sectionId: uuid().references(() => sectionsTable.id),
	createdAt,
	updatedAt,
	name: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
});
