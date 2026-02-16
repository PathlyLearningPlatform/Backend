import { ExerciseDifficulty } from '@pathly-backend/contracts/learning-paths/v1/activities.js';
import { z } from 'zod';

export const idSchema = z.uuid();
export const nameSchema = z.string().min(1).max(255);
export const descriptionSchema = z.string().max(5000);
export const orderSchema = z.number().int().min(0);
export const lessonIdSchema = z.uuid();
export const refSchema = z.string().min(1);
export const difficultySchema = z.enum(ExerciseDifficulty);
export const questionContentSchema = z.string();
export const questionCorrectAnswerSchema = z.string();
export const questionIdSchema = z.uuid();

export const limitSchema = z.number().int().min(1).max(100);
export const pageSchema = z.number().int().min(0);
