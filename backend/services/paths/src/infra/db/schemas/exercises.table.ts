import { pgEnum, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { ExerciseDifficultyEnum } from '@/domain/paths/enums';
import { itemsTable } from './items.table';

export const exerciseDifficultyEnum = pgEnum('exercise_difficulty', [
	ExerciseDifficultyEnum.EASY,
	ExerciseDifficultyEnum.MEDIUM,
	ExerciseDifficultyEnum.HARD,
]);

export const exercisesTable = pgTable('exercises', {
	itemId: uuid()
		.primaryKey()
		.references(() => itemsTable.id),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	difficulty: exerciseDifficultyEnum().notNull(),
});
