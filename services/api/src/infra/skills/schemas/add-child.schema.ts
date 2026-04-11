import { z } from 'zod';

export const addChildSkillSchema = z
	.object({
		parentSkillId: z.uuid(),
		childSkillId: z.uuid(),
	})
	.strict();
