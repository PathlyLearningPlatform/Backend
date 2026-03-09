import { z } from 'zod';

export const reorderSectionSchema = z
	.object({
		sectionId: z.uuid(),
		order: z.int32().nonnegative(),
	})
	.strict();
