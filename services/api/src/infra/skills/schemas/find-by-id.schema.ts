import { z } from 'zod';

export const findSkillByIdSchema = z
	.object({
		id: z.uuid(),
	})
	.strict();
