import { z } from 'zod';

export const descriptionSchema = z.string().max(500).nullable();
export const nameSchema = z.string().max(255);
export const orderSchema = z.int32().nonnegative();
export const lessonIdSchema = z.uuid();
export const refSchema = z.string().url();
export const difficultySchema = z.enum(['easy', 'medium', 'hard']);
export const contentSchema = z.string().min(1);
export const correctAnswerSchema = z.string().min(1);
