import { z } from 'zod';

export const listSkillPrerequisitiesSchema = z
	.object({
		skillId: z.uuid(),
	})
	.strict();
