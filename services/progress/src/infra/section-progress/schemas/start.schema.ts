import z from 'zod';
import { sectionIdSchema, userIdSchema } from './fields';

export const startSectionSchema = z
	.object({
		userId: userIdSchema,
		sectionId: sectionIdSchema,
	})
	.strict();
