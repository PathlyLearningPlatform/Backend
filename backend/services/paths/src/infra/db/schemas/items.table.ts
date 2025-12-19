import { integer, pgEnum, pgTable, unique, uuid } from 'drizzle-orm/pg-core';
import { ItemType } from '@/domain/items/enums';
import { createdAt, updatedAt } from './helpers';
import { lessonsTable } from './lessons.table';

export const itemTypeEnum = pgEnum('item_type', ItemType);

export const itemsTable = pgTable(
	'items',
	{
		id: uuid().primaryKey().defaultRandom(),
		lessonId: uuid()
			.notNull()
			.references(() => lessonsTable.id),
		createdAt,
		updatedAt,
		order: integer(),
		type: itemTypeEnum().notNull(),
	},
	(t) => [unique().on(t.lessonId, t.order)],
);
