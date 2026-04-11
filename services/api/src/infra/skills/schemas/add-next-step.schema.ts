import { z } from 'zod';

export const addNextStepSkillSchema = z
	.object({
		prerequisiteSkillId: z.uuid(),
		targetSkillId: z.uuid(),
	})
	.strict();
