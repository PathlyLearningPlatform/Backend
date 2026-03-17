import z from 'zod';
import { sectionIdSchema, userIdSchema } from './fields';

export const findSectionProgressForUserSchema = z
	.object({
		userId: userIdSchema,
		sectionId: sectionIdSchema,
	})
	.strict();
