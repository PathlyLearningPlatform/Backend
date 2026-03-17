import z from 'zod';

export const userIdSchema = z.uuid();
export const unitIdSchema = z.uuid();
export const sectionIdSchema = z.uuid();
export const unitProgressIdSchema = z.uuid();
export const limitSchema = z.int32().min(5).max(100).default(50);
export const pageSchema = z.int32().nonnegative().default(0);
