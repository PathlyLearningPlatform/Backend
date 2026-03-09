import { pgEnum, pgTable, uuid } from 'drizzle-orm/pg-core';
import { ExerciseDifficulty } from '@/domain/activities/exercises/value-objects';
import { activitiesTable } from './activities.table';

export const exerciseDifficultyEnum = pgEnum(
	'exercise_difficulty',
	ExerciseDifficulty,
);

export const exercisesTable = pgTable('exercises', {
	activityId: uuid('activity_id')
		.primaryKey()
		.references(() => activitiesTable.id, { onDelete: 'cascade' }),
	difficulty: exerciseDifficultyEnum().notNull(),
});
