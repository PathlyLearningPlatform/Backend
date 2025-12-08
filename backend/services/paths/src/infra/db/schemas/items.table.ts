import { integer, pgEnum, pgTable, unique, uuid } from 'drizzle-orm/pg-core';
import { ItemTypeEnum } from '@/domain/paths/enums';
import { createdAt, updatedAt } from './helpers';
import { lessonsTable } from './lessons.table';

export const itemTypeEnum = pgEnum('item_type', [
	ItemTypeEnum.EXERCISE,
	ItemTypeEnum.QUIZ,
	ItemTypeEnum.THEORY_BLOCK,
]);

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
