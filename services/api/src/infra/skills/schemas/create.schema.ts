import { z } from 'zod';

export const createSkillSchema = z
	.object({
		name: z.string().trim().min(1),
		parentId: z.uuid().optional(),
	})
	.strict();
