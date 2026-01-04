import { z } from 'zod';

export const findOneUnitSchema = z
	.object({
		where: z
			.object({
				id: z.uuid(),
			})
			.strict(),
	})
	.strict();
