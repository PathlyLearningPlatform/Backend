import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { createdAt, updatedAt } from './helpers';
import { pathsTable } from './paths.table';
import { sectionsTable } from './sections.table';

export const projectsTable = pgTable('projects', {
	id: uuid().primaryKey().defaultRandom(),
	pathId: uuid().references(() => pathsTable.id),
	sectionId: uuid().references(() => sectionsTable.id),
	createdAt,
	updatedAt,
	name: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
});
