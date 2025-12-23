import { z } from 'zod';

export const removeUnitSchema = z
	.object({
		where: z
			.object({
				id: z.uuid(),
			})
			.strict(),
	})
	.strict();
