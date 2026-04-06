import { z } from 'zod';

export const removeSectionProgressSchema = z
	.object({
		sectionId: z.uuid(),
		userId: z.uuid(),
	})
	.strict();
