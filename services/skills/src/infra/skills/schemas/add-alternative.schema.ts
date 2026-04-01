import { z } from 'zod';

export const addAlternativeSkillSchema = z
	.object({
		firstSkillId: z.uuid(),
		secondSkillId: z.uuid(),
	})
	.strict();
