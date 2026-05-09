import { ActivityType } from '@/domain/activities';
import z from 'zod';

export const createActivitySchema = z.object({
	name: z.string(),
	description: z.string().optional().nullable().default(null),
	type: z.enum(ActivityType),
	lessonId: z.uuid(),
});

export const updateActivitySchema = z
	.object({
		name: z.string().optional(),
		description: z.string().optional().nullable().default(null),
	})
	.optional();
