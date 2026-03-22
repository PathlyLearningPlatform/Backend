import { z } from 'zod';

export const listCommonSkillsSchema = z
	.object({
		skillId: z.uuid(),
	})
	.strict();
