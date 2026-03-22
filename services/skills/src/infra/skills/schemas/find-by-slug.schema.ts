import { z } from 'zod';

export const findSkillBySlugSchema = z
	.object({
		slug: z.string().trim().min(1),
	})
	.strict();
