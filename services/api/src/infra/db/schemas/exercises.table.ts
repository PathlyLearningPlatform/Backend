import {
	ExerciseDifficulty,
	ExerciseStatus,
	ExerciseSubmissionConclusion,
	ExerciseSubmissionStatus,
} from '@/domain/exercises';
import {
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
	integer,
} from 'drizzle-orm/pg-core';
import { createdAt, updatedAt } from './helpers';

export const exerciseStatusEnum = pgEnum('exercise_status', ExerciseStatus);
export const exerciseSubmissionStatus = pgEnum(
	'exercise_submission_status',
	ExerciseSubmissionStatus,
);
export const exerciseSubmissionConclusion = pgEnum(
	'exercise_submission_conclusion',
	ExerciseSubmissionConclusion,
);
export const exerciseDifficulty = pgEnum(
	'exercise_difficulty',
	ExerciseDifficulty,
);

export const exercisesTable = pgTable('exercises', {
	id: uuid().primaryKey(),
	name: text().notNull(),
	description: text(),
	acceptUrl: text('accept_url').notNull(),
	difficulty: exerciseDifficulty().notNull(),
	createdAt,
	updatedAt,
	repositoryId: integer('repository_id').notNull().unique(),
});

export const exerciseProgressTable = pgTable(
	'exercise_progress',
	{
		exerciseId: uuid('exercise_id')
			.notNull()
			.references(() => exercisesTable.id),
		userId: uuid('user_id').notNull(),
		completedAt: timestamp('completed_at'),
		updatedAt,
		status: exerciseStatusEnum().notNull(),
		repositoryUrl: text('repository_url').notNull(),
		repositoryId: integer('repository_id').notNull().unique(),
	},
	(t) => [primaryKey({ columns: [t.exerciseId, t.userId] })],
);

export const exerciseSubmissionsTable = pgTable('exercise_submissions', {
	id: uuid().primaryKey(),
	exerciseId: uuid('exercise_id')
		.notNull()
		.references(() => exercisesTable.id),
	userId: uuid('user_id').notNull(),
	updatedAt,
	submittedAt: timestamp('submitted_at').notNull(),
	status: exerciseSubmissionStatus().notNull(),
	commitSha: text('commit_sha').notNull().unique(),
	conclusion: exerciseSubmissionConclusion(),
});
