import { pgEnum, pgTable, uuid } from 'drizzle-orm/pg-core';
import { ExerciseDifficulty } from '@/domain/exercises/enums';
import { activitiesTable } from './activities.table';

export const exerciseDifficultyEnum = pgEnum(
	'exercise_difficulty',
	ExerciseDifficulty,
);

export const exercisesTable = pgTable('exercises', {
	activityId: uuid()
		.primaryKey()
		.references(() => activitiesTable.id),
	difficulty: exerciseDifficultyEnum().notNull(),
});
