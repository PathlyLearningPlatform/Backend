import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { PathConstraints } from '@/domain/paths/enums';
import { createdAt, updatedAt } from './helpers';

export const pathsTable = pgTable('paths', {
	id: uuid().primaryKey().defaultRandom(),
	createdAt,
	updatedAt,
	name: varchar({ length: PathConstraints.MAX_NAME_LENGTH }).notNull(),
	description: text(),
});
