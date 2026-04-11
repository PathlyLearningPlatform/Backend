import { z } from 'zod';

export const updateSkillSchema = z
	.object({
		where: z
			.object({
				id: z.uuid(),
			})
			.strict(),
		fields: z
			.object({
				name: z.string().trim().min(1).optional(),
			})
			.strict(),
	})
	.strict();
