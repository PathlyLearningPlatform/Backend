import { z } from 'zod';

export const listSkillAlternativesSchema = z
	.object({
		skillId: z.uuid(),
	})
	.strict();
