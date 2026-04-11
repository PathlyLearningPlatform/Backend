import { z } from 'zod';

export const listSkillChildrenSchema = z
	.object({
		skillId: z.uuid(),
	})
	.strict();
