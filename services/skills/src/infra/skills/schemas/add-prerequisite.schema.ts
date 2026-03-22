import { z } from 'zod';

export const addPrerequisiteSkillSchema = z
	.object({
		prerequisiteSkillId: z.uuid(),
		targetSkillId: z.uuid(),
	})
	.strict();
