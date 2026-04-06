import { z } from 'zod';

export const findSectionProgressForUserSchema = z
	.object({
		sectionId: z.uuid(),
		userId: z.uuid(),
	})
	.strict();
