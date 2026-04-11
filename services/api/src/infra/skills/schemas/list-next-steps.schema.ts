import { z } from 'zod';

export const listSkillNextStepsSchema = z
	.object({
		skillId: z.uuid(),
	})
	.strict();
