import { z } from 'zod';

export const addCommonSkillSchema = z
	.object({
		firstSkillId: z.uuid(),
		secondSkillId: z.uuid(),
	})
	.strict();
