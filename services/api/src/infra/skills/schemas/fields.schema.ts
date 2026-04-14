import z from 'zod';

export const skillNameSchema = z.string().trim().min(1).max(255);
export const skillIdSchema = z.string().uuid();
