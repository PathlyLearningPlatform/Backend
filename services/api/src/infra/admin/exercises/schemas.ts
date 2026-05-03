import { ExerciseDifficulty } from '@/domain/exercises';
import z from 'zod';

export const createExerciseSchema = z.object({
	acceptUrl: z.url(),
	name: z.string(),
	description: z.string().optional(),
	repositoryId: z.int64(),
	difficulty: z.enum(ExerciseDifficulty),
});

export const updateExerciseSchema = z
	.object({
		name: z.string().optional(),
		description: z.string().nullable().optional(),
		difficulty: z.enum(ExerciseDifficulty).optional(),
	})
	.optional();
