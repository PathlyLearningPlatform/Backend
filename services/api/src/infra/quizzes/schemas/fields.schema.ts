import z from 'zod';

export const questionIdSchema = z.uuid();
export const questionContentSchema = z.string();
export const questionCorrectAnswerSchema = z.string();
