import { z } from 'zod';

export const removeSkillSchema = z
	.object({
		id: z.uuid(),
	})
	.strict();
