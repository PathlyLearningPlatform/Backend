import { z } from 'zod';

export const startSectionSchema = z
	.object({
		sectionId: z.uuid(),
		userId: z.uuid(),
	})
	.strict();
