import { z } from 'zod';

export const findOneSectionSchema = z
	.object({
		where: z
			.object({
				id: z.uuid(),
			})
			.strict(),
	})
	.strict();
