import {
	integer,
	pgTable,
	text,
	unique,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';
import { UnitConstraints } from '@/domain/units/enums';
import { createdAt, updatedAt } from './helpers';
import { sectionsTable } from './sections.table';

export const unitsTable = pgTable(
	'units',
	{
		id: uuid().primaryKey().defaultRandom(),
		sectionId: uuid()
			.notNull()
			.references(() => sectionsTable.id),
		createdAt,
		updatedAt,
		name: varchar({ length: UnitConstraints.MAX_NAME_LENGTH }).notNull(),
		description: text(),
		order: integer().notNull(),
	},
	(t) => [unique().on(t.sectionId, t.order)],
);
